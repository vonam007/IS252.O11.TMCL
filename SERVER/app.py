from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

lr_model = joblib.load('model_weights/LR_weight.joblib')
svm_model = joblib.load('model_weights/SVM_weight.joblib')
rfr_model = joblib.load('model_weights/RFR_weight.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        json_data = request.get_json()

        # Tạo DataFrame từ dictionary
        data = pd.DataFrame([json_data])

        pred_price = (lr_model.predict(data) + svm_model.predict(data) + rfr_model.predict(data))/3 
        
        response_data = extract4similar(pred_price)

    except Exception as e:
        return jsonify({'error': str(e)})
    return jsonify(response_data)

def extract4similar(price):
    df = pd.read_csv('final_dataset.csv')
    # Chọn các dòng thoả mãn điều kiện về giá
    price = price[0].round(2)
    condition = (df['Price'] >= 0.8 * price) & (df['Price'] <= 1.2 * price)

    # Chọn các dòng thoả mãn điều kiện về cột "title" sử dụng biểu thức chính quy
    def extract_first_letters(title, num_characters=25):  # Thay số 5 bằng số lượng chữ cái bạn muốn lấy
        return title[:num_characters] + '...'

    # Áp dụng hàm cho cột "title" và tạo cột mới "FirstLetters"
    df['FirstLetters'] = df['title'].apply(extract_first_letters)

    # Tạo DataFrame mới
    new_df = df[condition][['FirstLetters', 'Price', 'link']].head(4)

    # Tạo đối tượng JSON đầu tiên chỉ chứa pred_price
    json_list = [{"pred_price": float(price)}]

    # Tạo các đối tượng JSON cho từng dòng trong DataFrame df
    for index, row in new_df.iterrows():
        json_object = {
            "FirstLetters": row["FirstLetters"],
            "Price": row["Price"],
            "link": row["link"]
        }
        json_list.append(json_object)

    # Chuyển đổi danh sách thành chuỗi JSON
    json_result = json.dumps(json_list, indent=2)
    return json_result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)
