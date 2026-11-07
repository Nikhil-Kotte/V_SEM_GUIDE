#!/bin/bash
read -p "Enter the number: " num
if [ $num -le 1 ]; then
  echo "Neither Prime nor composite"
else
  for ((i = 2; i < num; i++))
  do
    if [ $((num % i)) -eq 0 ]; then
      echo "$num is not prime number"
      exit 0
    fi
  done
  echo "$num is prime number"
fi
