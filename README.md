# IoT Edge for Makers
IoT Edge for Makers is an IoT Edge module for interacting with hobbyist and prototype-friendly hardware such as the Raspberry Pi.

## Introduction
[IoT Edge](https://docs.microsoft.com/en-us/azure/iot-edge/how-iot-edge-works) is a managed service for managing and deploying IoT devices. IoT Edge devices run modules, which are Docker-compatible containers that run prewritten or custom code. The IoT Edge for Makers module allows developers to easily configure and interface with hobbyist hardware such as the Raspberry Pi to send and receive data from sensors, LEDs, and other peripherals.

In keeping with the modular approach, the IoT Edge for Makers module *only* handles input and output to and from the device to IoT Edge. Developers should create a second module to handle application logic. 

![Components](Components.svg) 

In our [examples folder](examples/readme.md), you'll find a sample configuration that would be applied to a Raspberry Pi with a LED, a button, and other components and how the inputs and outputs would be routed to another logic module.

## How to use
The steps below detail each step of setting up and provisioning a Raspberry Pi IoT Edge device and deploying the IoT Edge for Makers module. You will need an [Azure](http://azure.microsoft.com) account and a Raspberry Pi with an installed operating system such as Raspbian Jessie or Stretch. 

1. Create an Azure IoT Hub and register an IoT Edge Device by following the first two steps at https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-simulate-device-linux. You can complete these steps before setting up the Raspberry Pi. 

![Set up IoT Edge device](\assets\portal-add-device-snap.PNG)

2. Set up the Raspberry Pi with prerequisites by running the following commands in Terminal:
```
sudo apt update
sudo apt install python-pip -y
sudo pip install -U setuptools pip
sudo apt install python2.7-dev libffi-dev libssl-dev -y
sudo pip install -U cryptography idna
curl -sSL https://get.docker.com | sudo -E sh
sudo usermod -aG docker $USER
sudo pip install -U azure-iot-edge-runtime-ctl
```
Then, open `/boot/config.txt` and add the following lines:
```
dtparam=i2c_arm=on
dtparam=i2c=on
dtparam=i2c_arm_baudrate=100000
```
Save, then reboot the Raspberry Pi.
3. Continue with steps 3 and 4 https://docs.microsoft.com/en-us/azure/iot-edge/tutorial-simulate-device-linux to start the IoT Edge runtime. On step 4, "Deploy a module," enter `toolboc/johnny5onedge/` in the Image URI field. After completing this step, wait a few moments for the container to deploy to your device. Then, when you run `sudo docker ps`, you should see the IoT Edge for Makers module running.

## Details
Under the hood, the IoT Edge for Makers module uses [Johnny-Five](http://johnny-five.io/), a popular open source Javascript platform for IoT and robotic development that gives various IoT hardware devices a consistent programming interface. The IoT Edge module takes care of some challenges such as exposing GPIO through the Docker container. Currently, the IoT Edge for Makers module supports only the Raspberry Pi. However, it can be extended to support [other boards supported by the Johnny-Five platform](http://johnny-five.io/platform-support/) such as the Arduino UNO and Particle Photon.

## Troubleshooting and contributing

## License

MIT License

Copyright (c) 2018 IoT Edge for Makers contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
