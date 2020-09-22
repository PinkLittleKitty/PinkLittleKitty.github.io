---
layout: post
title: Scheduling learning rate to improve model performance 
published: false
comments: true
image: "/img/Test_loss.png"
share-img: "/img/Test_loss.png"
thumbnail: "/img/Test_loss.png"
---
# Quick Intro to Cyclic Learning Rate (CLR)

Without spending too much time in explaining Learning rate, I will straight forward jump to Cyclic Learning Rate (CLR) proposed in [1](https://arxiv.org/pdf/1506.01186.pdf). CLR changes the learning rate cyclically from low to high and back to low in a given bounds, this helps rapid traversal of saddle points (when learning rate increases) resulting in reaching higher accuracy faster and improved model performance. Shown below is the depiction of how learning rate changes cyclically where step size is the number of iterations considered in changing the learning rate from low to high. As the author states a cycle consists of approx 2-8 number of epochs.

<p align="center"> <img src="https://ai-how.github.io/img/CLR.png" width="200" height="100" /> </p>

# finding the min and max bounds

To identify the min and max learning rates, the paper suggest increasing the learning rate from low to some high value and monitor the loss, point where loss (or accuracy) starts to increase (or decrease for accuracy metrics) should be the bound for max learning rate. Below is an experiment I conducted to demonstrate this for SVHN dataset. Here the learning rate is changed linearly from .001 to .5 for 150 number of epochs.

<p align="center"> <img src="https://ai-how.github.io/img/min_max.png" width="450" height="300" /> </p>
Since the accuracy peaks at learning rate of .14 (circled red in figure above) the max learning rate is assigned this value. Once the bounds are identified the neural network based models are trained varying the learning rate cyclically.

# Evaluating model performance on train and test

Using the bounds evaluated above the CNN models are trained to classify the images. Below figure illustrates the CLR schedule to vary between identified min and max.

<p align="center"> <img src="https://ai-how.github.io/img/CLR_schedule.png" width="450" height="300" /> </p>

Two CNN based models are trained; one with CLR and one without using SGD as an optimizer. Below figure makes it evident that the losses using CLR is low when compared to using constant learning rate. Here the model is trained for a total of 80 epochs.

<p align="center"> <img src="https://ai-how.github.io/img/Train_loss.png" width="450" height="300" /> </p>

Further to demonstrate that CLR does really help estimating better model hyperparameters we compare the losses and the model accuracy over test data. Below figure illustrates that the calculated loss is low for models trained with Cyclic Learning rate as against the constant.

<p align="center"> <img src="https://ai-how.github.io/img/Test_loss.png" width="450" height="300" /> </p>

Further its quite evident that the models trained with CLR does provide enhanced classification accuracy shown below:


<p align="center"> <img src="https://ai-how.github.io/img/Test_accuracy.png" width="450" height="300" /> </p>

# Conclusion

CLR based scheduling to train neural network models does help in improving model performance. As the paper suggests increasing the learning rate let training explore loss surfaces by rapidly traversing saddle points. The full code along with its implementation is available at my github repo github.com/ai-how
