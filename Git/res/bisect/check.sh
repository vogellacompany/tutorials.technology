#!/bin/bash
FILE=$1
 
if [ -f $FILE ];
then
   exit 0;
else
   exit 1;
fi

