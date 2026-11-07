import smtplib

# the people who should receive the mail
li = ["friend1@gmail.com", "friend2@gmail.com"]

for dest in li:
    s = smtplib.SMTP('smtp.gmail.com', 587)   # connect to Gmail's SMTP server
    s.starttls()                              # switch to an encrypted (TLS) connection
    s.login("your_email@gmail.com", "xxxx xxxx xxxx xxxx")  # Gmail address + 16-character App password
    message = "hello my dear friends"
    s.sendmail("your_email@gmail.com", dest, message)
    s.quit()
