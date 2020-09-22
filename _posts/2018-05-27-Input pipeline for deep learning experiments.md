---
layout: post
title: Input pipeline for deep learning experiments in Keras, Tensorflow and Pytorch 
published: false
comments: true
---
# Why input data pipeline needs to be optimal ?

Increasing list of algorithms and techniques aiming to improve the performance of deep learning models often instills a curiosity to benchmark how well these models perform. Benchmarking these techniques (on a dataset specific to business) often require writing your own pipeline which could quickly fetch mini-batches and run multiple iterations to search for optimal hyper parameters.

A quick and dirty practice is to load your training data into RAM using numpy and pandas functionalities (np.laod or pd.read_csv). This works well only if the dataset is small enough to fit in the memory. From a personal experience this slows down the entire training process resulting in longer model development and evaluation cycle. This blog post describes how you can quickly write input pipeline on a platform of your own choice:

# Keras
keras has been the standard choice to start with deep learning experiments as it avoid understanding all the nitty gritty details and provides a high level API to build model. For any deep learning experiment the training involves updating the model weights by estimating the gradients of loss w.r.t model hyperparameters. To quickly iterate through the data requires how fast the mini-batches can be fetched and run on GPU for loss and gradient computation. Numpy offers the functionality to read the data from disk without loading into RAM (a great relief !! as it frees the space for other processing). Code snippet below details how mini-batches are fetched:

```python
##=============================================##
##  data iterator reads data from disk ========##
## and yields mini-batches for weight updation=##
##=============================================##

batch_size =    # defines the mini-batch size

def train_data_gen():
    while 1:
        feat_path = "/path/to/feature/file/*.npy"
        label_path = "/path/to/label/file/*.npy"
        x = np.load(feat_path, mmap_mode='r')     # points to data location in memory mapped mode
        y = np.load(label_path, mmap_mode='r')    # reduced space requirement since data is not loaded in RAM
        lst = range(x.shape[0])
        ##=====================================##
        ## index shuffling after each epoch====##
        ##=====================================##
        shuffle(lst)
        iters = len(lst)/batch_size
        print (iters)
        for i in range(iters):
            # create numpy arrays of input data
            # and labels, from each line in the file
            #print (len(lst[(i*batch_size):((i+1)*batch_size)]))
            yield (x[lst[(i*batch_size):((i+1)*batch_size)]], y[lst[(i*batch_size):((i+1)*batch_size)]])
```

Note: Avoid loading the data into RAM and read data from disk on an iteration basis. However when using this iterator with Keras .fit_generator queues the mini-batches for seamless training without requiring an optimizer to wait for next batch

# Tensorflow

Tensorflow offers queuing mechanisms which are thread safe helps implement queues improving the time required for fetching mini-batch. Below GIF illustrates the queuing.

<p align="center"> <img src="https://www.tensorflow.org/images/IncremeterFifoQueue.gif" width="450" height="300" /> </p>

```python

##=======================================================##
##  data loader reads data from disk ====================##
## fills the queue and yields mini-batch of desried size=##
##=======================================================##

class ThreadRunner(object):
    """
    This class manages the queuing and dequeuing.
    """
    def __init__(self):
        self.feat = tf.placeholder(dtype=tf.float32, shape=[None,25,25])
        self.labels = tf.placeholder(dtype=tf.int32, shape=[None,])
        self.name = tf.placeholder(dtype=tf.string, shape=[None,])
        # queue defined using tensorflow holds the fetaures and labels equal to capacity defined
        self.queue = tf.RandomShuffleQueue(shapes=[[25,25],[25,25],[]],
                                           dtypes=[tf.float32,tf.int32,tf.string],
                                           capacity=1384,
                                           min_after_dequeue=1000)
        # filling queue using enqueue_many operations
        self.enqueue_op = self.queue.enqueue_many([self.feat,self.labels,self.name])
    def get_inputs(self):
        """
        Return's tensors containing a batch of feature sets and labels of size 32
        """
        features, labels, name = self.queue.dequeue_many(32)
        return features, labels, name
    def thread_main(self, sess):
        """
        Function run on alternate thread. Basically, keep adding data to the queue.
        """
        for features, labels, name in data_iterator():
            sess.run(self.enqueue_op, feed_dict={self.feat:features,self.labels:labels, self.name:name})
    def start_threads(self, sess, n_threads=2):
        """ Start background threads to feed queue """
        threads = []
        for n in range(n_threads):
            #print "thread started :", n
            sys.stdout.flush()
            t = threading.Thread(target=self.thread_main, args=(sess,))
            t.daemon = True # thread will close when parent quits
            t.start()
            threads.append(t)
        return threads
        
##=======================================================##
## restricts the queuing process to cpu==================##
##=======================================================##

with tf.device("/cpu:0"):
    run_thread = ThreadRunner()
    features, labels, name = run_thread.get_inputs()

##=======================================================##
## initiating the session and starting threads===========##
##=======================================================##
sess = tf.Session()
tf.train.start_queue_runners(sess=sess)
custom_runner.start_threads(sess)
print "thread started :"

##=======================================================##
## to load the data simply run sess as below=============##
##=======================================================##

feat_X, Y = sess.run([features, labels, name])

##=======================================================##
## call optimizer to run on mini-batch===================##
##=======================================================##

sess.run([train_opt], feed_dict = {X: feat_X, Y: Y})
```

# Pytorch

Recently switched to Pytorch for its greater flexibility and wide adoption among research community. An initial glance to their data loader API poses the following limitation (basis my understanding):
* Requires loading data to use their dataloader API
* Inability to use data iterator using numpy in memmap mode to fetch mini-batches

Thus decided to write my own dataloader API which fetched mini-batch from disk and fills the data in queues (one in CPU and another in GPU). Thus queue in GPU is filled using queue available in CPU thereby reducing latency in data transfer and overall model training cycle. The below script is modified and adapted for my own purpose from [1](https://www.sagivtech.com/2017/09/19/optimizing-pytorch-training-code/)

```python

import Queue
import Thread

class InputGen:	
	def __iter__(self):
		while 1:
			feat_path = "/path/to/feature/file/*.npy"
			label_path = "/path/to/label/file/*.npy"
			x = np.load(feat_path, mmap_mode='r')
			y = np.load(label_path, mmap_mode='r')
			iters = x.shape[0]/batch_size
			for i in range(iters+1):
				if i< iters:
					Xtrain = np.transpose(x[(i*batch_size):((i+1)*batch_size)], (0,3,1,2))
					ytrain = y[(i*batch_size):((i+1)*batch_size)]
					yield (i, Xtrain, ytrain)
				else:
					Xtrain = np.transpose(x[(i*batch_size):], (0,3,1,2))
					ytrain = y[(i*batch_size):]
					yield (i, Xtrain, ytrain)

def threaded_batches_feeder(tokill, batches_queue, dataset_generator):
	"""Threaded worker for pre-processing input data.
	tokill is a thread_killer object that indicates whether a thread should be terminated
	dataset_generator is the training/validation dataset generator
	batches_queue is a limited size thread-safe Queue instance.
	"""
	while tokill() == False:
		for i, (indx, batch_images, batch_labels) \
			in enumerate(dataset_generator):
				batches_queue.put((indx, batch_images, batch_labels)\
								, block=True)
				if tokill() == True:
					return

def threaded_cuda_batches(tokill,cuda_batches_queue,batches_queue):
	"""Thread worker for transferring pytorch tensors into
	GPU. batches_queue is the queue that fetches numpy cpu tensors.
	cuda_batches_queue receives numpy cpu tensors and transfers them to GPU space.
	"""
	while tokill() == False:
		indx, batch_images, batch_labels = batches_queue.get(block=True)
		batch_images = torch.from_numpy(batch_images)
		batch_labels = torch.from_numpy(batch_labels)
		batch_images = Variable(batch_images).float().cuda()
		batch_labels = Variable(batch_labels).cuda()
		cuda_batches_queue.put((indx, batch_images, batch_labels), block=True)
		if tokill() == True:
			return
			
class thread_killer(object):
	"""Boolean object for signaling a worker thread to terminate
	"""
	def __init__(self):
		self.to_kill = False
	
	def __call__(self):
		return self.to_kill
	
	def set_tokill(self,tokill):
		self.to_kill = tokill

##====================================##
## define the queues for CPU and GPU==##
##====================================##
		
train_batches_queue = Queue(maxsize=40)
cuda_batches_queue = Queue(maxsize=15) ## increasing the size would hog the GPU, so be considerate

training_set_generator = InputGen()
train_thread_killer = thread_killer()
train_thread_killer.set_tokill(False)
preprocess_workers = 1

##===========================================##
## start threads to fill GPU and CPU queues==##
##===========================================##

print ("starting thread ")
for _ in range(preprocess_workers):
	t = Thread(target=threaded_batches_feeder, \
			args=(train_thread_killer, train_batches_queue, training_set_generator))
	t.start()
cuda_transfers_thread_killer = thread_killer()
cuda_transfers_thread_killer.set_tokill(False)
cudathread = Thread(target=threaded_cuda_batches, \
			args=(cuda_transfers_thread_killer, cuda_batches_queue, train_batches_queue))
cudathread.start()
print ("thread started")
sys.stdout.flush()

##=================================##
## fetch mini-batch for training ==##
##=================================##

features, labels, index = cuda_batches_queue.get(block=True)

```

On a personal note, using these pipelines significantly reduces the model training time since the buffer of mini-batches are always maintained using queue and thus fetching them from queue is minimal. Use these techniques to optimize your deep learning pipelines when working on non-standard dataset for which input data pipelines are to be written.

Go Deep !!

