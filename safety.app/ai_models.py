import pandas as pd
from sklearn.tree import DecisionTreeClassifier

data = {
'area':[1,2,3,4,5],
'time':[1,2,3,4,5],
'crime':[2,3,4,5,6],
'risk':[0,0,1,1,1]
}

df = pd.DataFrame(data)

X = df[['area','time','crime']]
y = df['risk']

model = DecisionTreeClassifier()
model.fit(X,y)

def predict_risk(area,time,crime):

    result = model.predict([[area,time,crime]])

    if result[0]==1:
        return "Danger"
    else:
        return "Safe"