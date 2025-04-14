#!/bin/bash
trap "exit" INT

# Copy the assets and open the iOS project
ionic cap copy && ionic cap open ios