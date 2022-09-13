import cv2  #載入opencv 函式庫
import numpy as np

img = cv2.imread('Jhonny.jpg') #讀取影片由 img 接收

img = cv2.resize(img, (0,0), fx = 0.5, fy = 0.5) # → 圖片size 調整

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

faceRect = faceCascade.detectMultiScale(gray, 1.1, 5)

print(len(faceRect))

for (x, y, w, h) in faceRect:
    cv2.rectangle(img, (x,y), (x+w,y+h), (0, 255, 0), 2)


cv2.imshow('My lovely picture',img)  #title,  picture 名稱
# cv2.imshow('gray',gray) 
cv2.waitKey(0) # 0 → 等鍵盤按才關，單位毫秒



# 執行: python cv2Test.py 

# 以下是取用視訊鏡頭畫面
 cap = cv2.VideoCapture(0)  #default inner capture

 while True:
     ret, frame = cap.read()
     if ret:
         frame = cv2.resize(frame, (0,0), fx=1.2, fy=1.2)
         cv2.imshow('video', frame)
     else:
         break
     if cv2.waitKey(10) == ord('q'):
         break 
