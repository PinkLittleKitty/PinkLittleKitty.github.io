---
layout: post
title: Understanding GANs; analyzing Generator and Discriminator losses 
published: false
comments: true
---

GANs; known as Generative Adversarial Networks proposed in 2014 by Ian Goodfellow for their ability to learn a function mapping a random distribution to desired. Given this mapping, the function can synthetically generate desired number of observations. Starting from a random distribution or a given prior the generator adjusts its parameters so as to be able to generate samples closer to real distribution as evident below (taken from [machinelearning@Apple](https://machinelearning.apple.com/2017/07/07/GAN.html))

<p align="center"> <img src="https://machinelearning.apple.com/images/journals/gan/history.gif" width="450" height="300" /> </p>

GANs consists of two components generator and discriminator having their internal structure to be few or several layers deep; where each layer is perceptrons model or a convolutional layer choice among two depends on the type of distribution to be learned. Areas where GANs have/could demonstrates its potentials:

* Improving the resolution of images
* Image generation given a text
* Animation; generating sequence of still frames given a description
* Generating samples for low occurence events

# How it works
As for most supervised learning, GANs require the samples from true distribution to be learned. Assuming the task is to refine synthetic images as close as possible to real, shown below

<p align="center"> <img src="https://machinelearning.apple.com/images/journals/gan/real_synt_refined_gaze.png" width="450" height="300" /> </p>

The discriminator objective in training phase is to maximize the score for every real sample it sees and simultaneously gives a lower score for every fake sample (coming from generator). On the other hand, the generator objective becomes to generate samples as real as possible to be able to fool discriminator. Training generator and discriminator goes in sequence for e.g. a discriminator is first trained to maximize the separation of average scores for real and fake samples. Given the low scores for each generated sample, the generator then penalizes itself to obtain the maximum score when passed through discriminator. This sequence of training generator (termed as refiner in the below illustration) and discriminator is continued as long as the generated/refined samples looks similar to true samples.

<p align="center"> <img src="https://machinelearning.apple.com/images/journals/gan/block_diag_gif.gif" width="450" height="300" /> </p>

Rather than starting from a random distribution the generator uses the prior of synthetic samples to refine the images as close as possible to real. In a way this enhances the convergence of generator as against starting to generate refined images from a random n-dimensional distribution. There exist numerous possibility to train GANs:
- Train discriminator first and then generator
  - In each round train discriminator n number of times and generator m times
- Train generator first and then discriminator
- Monitor visually by examining generated images; for cases where it becomes impossible to monitor images check losses for generator and discriminators

For cases if either of the discriminator or generator losses diverges quickly; train the specific component of GANs first followed with other. For e.g. if the generator loss keeps on increasing whereas the discriminator saturates train generator first for couple of iteration followed with training discriminators.
One interesting observation training GANs reveals, for each iteration of training generator and discriminator the average score value for real and fake samples shifts linearly while maintaining their separation. This indicates everytime the generator corrects itself for mistakes made in the previous round the discriminator becomes further smarter to label generated samples as fake, in a turn retaining its ability to isolate real from fake.
