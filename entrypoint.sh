#!/bin/bash

service ssh start

node .
tail -f /dev/null

