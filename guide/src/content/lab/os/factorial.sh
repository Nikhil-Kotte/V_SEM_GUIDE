#!/bin/bash
read -p "Enter your number: " num
fact=1
if [ $num -gt 0 ]; then
  for ((i = 1; i <= num; i++))
  do
    fact=$((fact * i))
  done
  echo "Factorial of $num is $fact"
else
  echo "Factorial doesn't exist for negative numbers"
fi
