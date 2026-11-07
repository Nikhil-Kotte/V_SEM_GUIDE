#!/bin/bash
read -p "Enter the number: " num
temp=$num
n=0
while [ $temp -gt 0 ]
do
  rem=$((temp % 10))
  n=$((n * 10 + rem))
  temp=$((temp / 10))
done
if [ $num -eq $n ]; then
  echo "$num is a palindrome number."
else
  echo "$num is not a palindrome number."
fi
