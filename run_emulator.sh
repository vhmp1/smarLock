#!/bin/sh
{
 adb wait-for-device
 adb shell chmod 666 /dev/ttyS2
} &
~/Android/Sdk/tools/emulator -avd t1 -qemu -serial /dev/pts/22
