#!/bin/bash
read -p "Enter the number: " num
count=0
temp=$num
res=0
# step 1: count the digits
while [ $temp -gt 0 ]
do
  count=$((count + 1))
  temp=$((temp / 10))
done
# step 2: add each digit raised to the power count
temp=$num
while [ $temp -gt 0 ]
do
  rem=$((temp % 10))
  res=$((res + rem ** count))
  temp=$((temp / 10))
done
if [ $res -eq $num ]; then
  echo "$num is an armstrong number"
else
  echo "$num is not an armstrong number"
fi
