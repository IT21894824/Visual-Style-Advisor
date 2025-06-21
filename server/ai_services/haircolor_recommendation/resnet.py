#!/usr/bin/python
# -*- encoding: utf-8 -*-

import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.utils.model_zoo as modelzoo

# URL for pre-trained ResNet-18 model
resnet18_url = 'https://download.pytorch.org/models/resnet18-5c106cde.pth'

def conv3x3(in_planes, out_planes, stride=1):
    """3x3 convolution with padding"""
    return nn.Conv2d(in_planes, out_planes, kernel_size=3, stride=stride,
                     padding=1, bias=False)

class BasicBlock(nn.Module):
    """Defines a basic residual block used in ResNet-18."""
    def __init__(self, in_chan, out_chan, stride=1):
        super(BasicBlock, self).__init__()
        self.conv1 = conv3x3(in_chan, out_chan, stride)  # First convolutional layer
        self.bn1 = nn.BatchNorm2d(out_chan)  # First batch normalization
        self.conv2 = conv3x3(out_chan, out_chan)  # Second convolutional layer
        self.bn2 = nn.BatchNorm2d(out_chan)  # Second batch normalization
        self.relu = nn.ReLU(inplace=True)  # ReLU activation function
        self.downsample = None  # Downsampling layer (for residual connection)
        if in_chan != out_chan or stride != 1:
            self.downsample = nn.Sequential(
                nn.Conv2d(in_chan, out_chan, kernel_size=1, stride=stride, bias=False),
                nn.BatchNorm2d(out_chan),
            )

    def forward(self, x):
        """Forward pass through the block."""
        residual = self.conv1(x)
        residual = F.relu(self.bn1(residual))
        residual = self.conv2(residual)
        residual = self.bn2(residual)

        shortcut = x  # Default shortcut connection
        if self.downsample is not None:
            shortcut = self.downsample(x)  # Apply downsampling if needed

        out = shortcut + residual  # Add residual connection
        out = self.relu(out)  # Apply ReLU activation
        return out

def create_layer_basic(in_chan, out_chan, bnum, stride=1):
    """Creates a sequence of BasicBlocks for a ResNet layer."""
    layers = [BasicBlock(in_chan, out_chan, stride=stride)]  # First block with possible downsampling
    for i in range(bnum-1):
        layers.append(BasicBlock(out_chan, out_chan, stride=1))  # Remaining blocks with stride 1
    return nn.Sequential(*layers)

class Resnet18(nn.Module):
    """Defines the ResNet-18 model."""
    def __init__(self):
        super(Resnet18, self).__init__()
        self.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)  # Initial convolutional layer
        self.bn1 = nn.BatchNorm2d(64)  # Batch normalization after first conv
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)  # Max pooling layer
        
        # ResNet layers
        self.layer1 = create_layer_basic(64, 64, bnum=2, stride=1)
        self.layer2 = create_layer_basic(64, 128, bnum=2, stride=2)
        self.layer3 = create_layer_basic(128, 256, bnum=2, stride=2)
        self.layer4 = create_layer_basic(256, 512, bnum=2, stride=2)
        
        self.init_weight()  # Initialize weights with pre-trained model

    def forward(self, x):
        """Forward pass through the ResNet-18 model."""
        x = self.conv1(x)
        x = F.relu(self.bn1(x))
        x = self.maxpool(x)

        x = self.layer1(x)
        feat8 = self.layer2(x)  # Output at 1/8 resolution
        feat16 = self.layer3(feat8)  # Output at 1/16 resolution
        feat32 = self.layer4(feat16)  # Output at 1/32 resolution
        return feat8, feat16, feat32

    def init_weight(self):
        """Loads pre-trained weights from ResNet-18."""
        state_dict = modelzoo.load_url(resnet18_url)  # Load ResNet-18 weights
        self_state_dict = self.state_dict()
        for k, v in state_dict.items():
            if 'fc' in k: continue  # Skip fully connected layers
            self_state_dict.update({k: v})
        self.load_state_dict(self_state_dict)

    def get_params(self):
        """Returns model parameters categorized for weight decay optimization."""
        wd_params, nowd_params = [], []
        for name, module in self.named_modules():
            if isinstance(module, (nn.Linear, nn.Conv2d)):
                wd_params.append(module.weight)  # Parameters subject to weight decay
                if not module.bias is None:
                    nowd_params.append(module.bias)  # Biases not subject to weight decay
            elif isinstance(module, nn.BatchNorm2d):
                nowd_params += list(module.parameters())  # BatchNorm parameters (no weight decay)
        return wd_params, nowd_params

if __name__ == "__main__":
    """Test script to check output dimensions."""
    net = Resnet18()
    x = torch.randn(16, 3, 224, 224)  # Create a random input tensor
    out = net(x)
    print(out[0].size())  # Print feature map size at 1/8 resolution
    print(out[1].size())  # Print feature map size at 1/16 resolution
    print(out[2].size())  # Print feature map size at 1/32 resolution
    net.get_params()  # Retrieve model parameters
