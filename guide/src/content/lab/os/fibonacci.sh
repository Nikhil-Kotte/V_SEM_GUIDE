#!/bin/bash
read -p "Enter the number of terms: " num
a=0
b=1
echo -n "$a $b "
for ((i = 2; i < num; i++))
do
  temp=$((a + b))
  a=$b
  b=$temp
  echo -n "$b "
done
echo
