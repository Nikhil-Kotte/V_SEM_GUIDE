#include <iostream>
#include <string>
using namespace std;

// XOR of two bit strings, dropping the first bit (one step of modulo-2 division)
string xorOperation(string a, string b) {
    string result = "";
    for (int i = 1; i < b.length(); i++) {
        if (a[i] == b[i])
            result += '0';
        else
            result += '1';
    }
    return result;
}

int main() {
    string data, divisor, received;
    cout << "Enter Data: ";
    cin >> data;
    cout << "Enter Divisor: ";
    cin >> divisor;

    int n = divisor.length();

    // sender: append n-1 zeros and divide
    string dividend = data;
    for (int i = 0; i < n - 1; i++)
        dividend += '0';

    string temp = dividend.substr(0, n);
    for (int i = n; i <= dividend.length(); i++) {
        if (temp[0] == '1')
            temp = xorOperation(temp, divisor);
        else
            temp = xorOperation(temp, string(n, '0'));
        if (i < dividend.length())
            temp += dividend[i];
    }

    string remainder = temp;
    string codeword = data + remainder;
    cout << "CRC Remainder: " << remainder << endl;
    cout << "Transmitted Codeword: " << codeword << endl;

    // receiver: divide the received codeword by the same divisor
    cout << "Enter Received Codeword: ";
    cin >> received;

    temp = received.substr(0, n);
    for (int i = n; i <= received.length(); i++) {
        if (temp[0] == '1')
            temp = xorOperation(temp, divisor);
        else
            temp = xorOperation(temp, string(n, '0'));
        if (i < received.length())
            temp += received[i];
    }

    bool error = false;
    for (char c : temp) {
        if (c != '0') {
            error = true;
            break;
        }
    }

    if (error)
        cout << "Error Detected" << endl;
    else
        cout << "No Error Detected" << endl;
    return 0;
}
