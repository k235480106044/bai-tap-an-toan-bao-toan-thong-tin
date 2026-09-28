Câu 1: Thuật toán mã hóa hiện đại DES và AES

1. Thuật toán DES (Data Encryption Standard)

DES là thuật toán mã hóa khối đối xứng (Symmetric Block Cipher) dựa trên mạng Feistel, mã hóa dữ liệu theo từng khối 64-bit sử dụng khóa có độ dài 64-bit (trong đó 56-bit làm khóa thực tế, 8-bit dùng để kiểm tra chẵn lẻ/parity).

- Quy trình mã hóa:

Bước 1: Hoán vị ban đầu (Initial Permutation - IP): Khối rõ 64-bit được sắp xếp lại vị trí các bit theo bảng hoán vị IP cố định, sau đó tách làm 2 nửa 32-bit: L_0 (trái) và R_0 (phải).

Bước 2: 16 vòng biến đổi Feistel (16 Rounds): Với mỗi vòng i từ 1 đến 16:

	L_i=R_(i-1)
	
	R_i=L_(i-1)⊕F(R_(i-1),K_i )
	
	Khóa vòng (K_i): Từ khóa gốc 56-bit, qua hàm sinh khóa phụ sẽ trích xuất ra khóa vòng 48-bit cho từng vòng.
	
	Hàm F(R_(i-1),K_i ):
	
	Mở rộng (Expansion - E): Mở rộng R_(i-1) từ 32-bit lên 48-bit.
	
	XOR: Thực hiện E(R_(i-1) )⊕K_i.
	
	Thay thế (S-Boxes): Chia 48 bit thành 8 nhóm 6-bit, đưa qua 8 hộp thế S_1…S_8 để chuyển đổi phi tuyến tính thành 8 nhóm 4-bit (tổng cộng 32-bit).
	
	Hoán vị (Permutation - P): Hoán vị 32 bit này theo bảng hoán vị P.
	
Bước 3: Đảo vị trí & Hoán vị kết thúc (IP^(-1)): Sau vòng 16, hai nửa ghép lại thành (R_16,L_16 ) (đảo ngược vị trí) và đi qua bảng hoán vị nghịch đảo IP^(-1) để ra bản mã (Ciphertext) 64-bit.

2. Thuật toán AES (Advanced Encryption Standard)

AES là thuật toán mã hóa đối xứng cấu trúc Mạng thay thế - hoán vị (Substitution-Permutation Network - SPN). Dữ liệu xử lý theo khối cố định 128-bit (16 byte), được xếp thành bảng ma trận trạng thái 4×4 byte gọi là State. Độ dài khóa linh hoạt: 128-bit (10 vòng), 192-bit (12 vòng), hoặc 256-bit (14 vòng).

- Quy trình mã hóa:

Bước 1: Khởi tạo: AddRoundKey ban đầu với khóa K_0.

Bước 2: Vòng 1 đến Round N-1 (Ví dụ N=10 với AES-128): Mỗi vòng áp dụng lần lượt 4 bước:

	SubBytes (Thay thế byte): Thay thế từng byte trong ma trận State phi tuyến tính qua hộp thế S-Box.
	
	ShiftRows (Dịch hàng): Dịch chuyển vòng các byte trên 4 hàng: Hàng 0 giữ nguyên, hàng 1 dịch trái 1 byte, hàng 2 dịch trái 2 byte, hàng 3 dịch trái 3 byte.
	
	MixColumns (Trộn cột): Nhân ma trận toán học từng cột của State với ma trận cố định trên trường Galois GF(2^8 ).
	
	AddRoundKey (Cộng khóa vòng): Thực hiện phép XOR từng byte của State với khóa vòng tương ứng.
	
      Bước 3:  Vòng cuối (Round N): Thực hiện giống các vòng trước nhưng bỏ qua bước MixColumns (SubBytes → ShiftRows → AddRoundKey).
      
3. Cài đặt mã hóa/giải mã AES (Ngôn ngữ Python)

Cài đặt mã hóa/giải mã AES-256 (Chế độ CBC): Python

import os

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from cryptography.hazmat.primitives import padding

def generate_key():

    """Tạo khóa AES-256 ngẫu nhiên (32 bytes = 256 bits)"""

    return os.urandom(32)

def encrypt_aes_cbc(plaintext: str, key: bytes):

    """Mã hóa văn bản bằng AES-256-CBC"""

    # 1. Tạo Vector Khởi tạo (IV) ngẫu nhiên 16 bytes

    iv = os.urandom(16)

    # 2. Đệm dữ liệu (Padding PKCS7) cho đủ bội số của 16 bytes

    padder = padding.PKCS7(128).padder()

    padded_data = padder.update(plaintext.encode('utf-8')) + padder.finalize()

    # 3. Khởi tạo Cipher

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))

    encryptor = cipher.encryptor()

    # 4. Thực hiện mã hóa

    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    # Trả về IV kết hợp Ciphertext

    return iv, ciphertext

def decrypt_aes_cbc(iv: bytes, ciphertext: bytes, key: bytes) -> str:

    """Giải mã văn bản bằng AES-256-CBC"""

    # 1. Khởi tạo Cipher giải mã

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))

    decryptor = cipher.decryptor()

    # 2. Thực hiện giải mã

    padded_data = decryptor.update(ciphertext) + decryptor.finalize()

    # 3. Bỏ đệm dữ liệu (Unpadding)

    unpadder = padding.PKCS7(128).unpadder()

    data = unpadder.update(padded_data) + unpadder.finalize()

    return data.decode('utf-8')

# --- CHƯƠNG TRÌNH THỬ NGHIỆM ---

if __name__ == "__main__":

    # Khởi tạo dữ liệu

    key = generate_key()

    original_message = "Thong tin bao mat môn An toan thong tin 2026!"

    print(f"Văn bản gốc: {original_message}")

    # Thực hiện mã hóa

    iv, ciphertext = encrypt_aes_cbc(original_message, key)

    print(f"Bản mã (Hex): {ciphertext.hex()}")

    print(f"Vector IV (Hex): {iv.hex()}")

    # Thực hiện giải mã

    decrypted_message = decrypt_aes_cbc(iv, ciphertext, key)

    print(f"Văn bản giải mã: {decrypted_message}")

Câu 2: Thuật toán mã hóa bất đối xứng RSA


- Nguyên lý sinh cặp khóa Bí mật & Công khai

Các bước chi tiết:

	Chọn số nguyên tố: Chọn ngẫu nhiên hai số nguyên tố rất lớn p và q (p≠q).
	
	Tính tích n: n=p×q
	
(n gọi là modulus, độ dài bit của n chính là độ dài khóa RSA, ví dụ 2048-bit hoặc 4096-bit).

	Tính hàm số Euler ϕ(n):
	
ϕ(n)=(p-1)(q-1)

	Chọn số mũ công khai e: Chọn e sao cho 1<e<ϕ(n) và e nguyên tố cùng nhau với ϕ(n):
	
gcd⁡(e,ϕ(n))=1)

(Trong thực tế, giá trị e thường chọn cố định là 65537 hay 2^16+1).

	Tính số mũ bí mật d: d là phần tử nghịch đảo nhân của e theo modulo ϕ(n):
	
d⋅e≡1 (mod ϕ(n)) "hay" d=e^(-1) mod⁡ϕ (n)

	Thành phần các khóa:
	
	Khóa công khai (Public Key): PU=(e,n)
	
	Khóa bí mật (Private Key): PR=(d,n) (và phải bảo mật các tham số p,q,ϕ(n)).
	
Công thức Mã hóa / Giải mã RSA:

	Mã hóa: Chuyển văn bản rõ thành số M<n. Bản mã C tính bằng:
	
C=M^e mod⁡n 

	Giải mã: Bản rõ M khôi phục từ bản mã C bằng:
	
M=C^d mod⁡n 

Câu 3: Các mô hình áp dụng RSA và sự kết hợp RSA - AES

1. Các mô hình ứng dụng RSA

a. Mô hình Bảo mật / Xác thực người nhận (Confidentiality)

Mục đích: Chỉ có người nhận hợp lệ mới có thể đọc được nội dung thông điệp.

- Tính chất: Đảm bảo tính bí mật. Do chỉ có người nhận B giữ mới giải mã được.

b. Mô hình Chữ ký số / Xác thực người gửi (Authentication & Non-repudiation)

Mục đích: Xác nhận chính xác danh tính người gửi và đảm bảo dữ liệu không bị thay đổi.

- Tính chất: Đảm bảo tính xác thực người gửi và chống chối bỏ. Do chỉ có A nắm giữ mới tạo ra được chữ ký S.

c. Mô hình Kết hợp / Xác thực cả hai (Confidentiality + Authentication)

Mục đích: Vừa đảm bảo tính bí mật, vừa xác thực đúng danh tính người gửi.

2. So sánh thời gian mã hóa/giải mã: RSA vs AES
   
Tiêu chí	RSA (Bất đối xứng)	AES (Đối xứng)

Bản chất toán học	Dựa trên phép lũy thừa modulo trên các số cực lớn (2048 - 4096 bit).	Dựa trên các phép toán biến đổi ma trận, hoán vị, thay thế bit/byte đơn giản (GF(2^8 )).

Tốc độ xử lý	Chậm (Tốn rất nhiều tài nguyên CPU).	Rất nhanh (Nhanh gấp khoảng 1.000 - 10.000 lần so với RSA; được hỗ trợ bởi phần cứng Intel AES-NI).

Kích thước dữ liệu	Giới hạn (Dữ liệu mã hóa phải nhỏ hơn độ dài khóa n).	Không giới hạn (xử lý từng khối 128-bit nối tiếp nhau).

Ứng dụng chính	Trao đổi khóa, ký số, xác thực.	Mã hóa dữ liệu lớn (mảng dữ liệu, tệp tin, đường truyền mạng).


4. Mô hình kết hợp sức mạnh RSA và AES (Mã hóa lai - Hybrid Encryption)

Nhược điểm của AES là việc trao đổi khóa bí mật qua mạng không an toàn. Nhược điểm của RSA là xử lý dữ liệu lớn quá chậm. Việc kết hợp RSA và AES sẽ phát huy ưu điểm của cả hai: dùng AES để mã hóa dữ liệu nhanh và dùng RSA để truyền khóa AES an toàn

SƠ ĐỒ HOẠT ĐỘNG MÃ HÓA LAI (HYBRID CRYPTOSYSTEM)

QUY TRÌNH MÃ HÓA VÀ GỬI (Người gửi A):

[Dữ liệu lớn]    ──(Mã hóa bằng Khóa Session AES)──► [Bản mã Dữ liệu (AES)]

[Khóa Session]   ──(Mã hóa bằng RSA Public Key B)──► [Bản mã Khóa (RSA)]

=> Gửi cả [Bản mã Dữ liệu] + [Bản mã Khóa] qua mạng cho B.

QUY TRÌNH GIẢI MÃ (Người nhận B):

[Bản mã Khóa]    ──(Giải mã bằng RSA Private Key B)─► [Khóa Session AES]

[Bản mã Dữ liệu] ──(Giải mã bằng Khóa Session AES) ──► [Dữ liệu gốc]

Quy trình các bước chi tiết:

	Tạo khóa phiên (Session Key): Người gửi A tự động sinh ra một khóa đối xứng AES tạm thời ngẫu nhiên K_AES (dùng 1 lần).
	
	Mã hóa dữ liệu: A dùng K_AES mã hóa toàn bộ tập tin/thông điệp dung lượng lớn bằng thuật toán AES → Thu được Ciphertext_Data.
	
	Mã hóa khóa phiên: A dùng Khóa công khai RSA của B (PU_B) để mã hóa khóa K_AES → Thu được Ciphertext_Key.
	
	Gửi dữ liệu: A gói [Ciphertext_Data + Ciphertext_Key] gửi cho B.
	
	Giải mã phía B: B dùng Khóa bí mật RSA của mình (PR_B) để giải mã Ciphertext_Key → Thu lại khóa phiên K_AES.
	
- B dùng khóa K_AES vừa giải mã được để giải mã Ciphertext_Data → Thu lại nội dung dữ liệu ban đầu.

Ứng dụng thực tế: Mô hình lai này chính là nền tảng cốt lõi được ứng dụng trong các giao thức bảo mật phổ biến nhất hiện nay như TLS/SSL (HTTPS), PGP (Email Security), và SSH.




