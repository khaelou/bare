#!/bin/bash
trap "exit" INT

# Copy the assets and open the Android project
ionic cap copy && ionic cap open android
