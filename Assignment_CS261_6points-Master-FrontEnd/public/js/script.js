function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const type = document.getElementById('role').value;

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-Key' : 'TUc8e9a774d9aa1222aca29d98ce6b48ff0ae975b29f1021699cb9ed3fb2ef65a93d1e2a39b79ae88dd56ef39239c88434'
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password,
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message || 'Login successful!';
        /*if (data.status) {  // ตรวจสอบว่าการ login สำเร็จหรือไม่
            showAccountInfo(data); // เรียกฟังก์ชันเพื่อแสดงข้อมูลบัญชี
            document.getElementById('userNameDisplay').innerText = `Name: ${data.displayname_th || 'N/A'}`; // แสดงชื่อผู้ใช้
        }*/
        if (data.status) {  // ตรวจสอบว่าการ login สำเร็จหรือไม่
            if(data.type === type){
                saveStudentData(data);

                showAccountInfo(data);
                document.getElementById('userNameDisplay').innerText = `Name: ${data.displayname_th || 'N/A'}`; // แสดงชื่อผู้ใช้
                
            } else if (data.type !== type){
                document.getElementById('message').innerText = 'Invalid Type!';
            }
        } else {
            //document.getElementById('message').innerText = 'Login failed!';
            openPopup(); 
        }
        // แสดงชื่อผู้ใช้ที่ดึงมาจาก API
        //document.getElementById('userNameDisplay').innerText = `Name: ${data.user.name}`;
        //document.getElementById('message').innerText = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
        //document.getElementById('message').innerText = 'An error occurred while processing your request.';
        openPopup(); 
    });
}

function openPopup() {
    document.getElementById('loginFailPopup').style.display = 'block';
}

function closePopup() {
    document.getElementById('loginFailPopup').style.display = 'none';
}

function saveStudentData(data) {
    fetch('http://localhost:8080/api/students/add', { // URL ต้องตรงกับ Spring Boot endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            engName: data.displayname_en,
            email: data.email,
            faculty: data.faculty,
            type: data.type,
            userName: data.username
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save data');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data saved successfully:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
     
}

// ฟังก์ชันแสดงข้อมูลบัญชีใน HTML
function showAccountInfo(data) {
    const accountInfoContainer = document.getElementById('accountInfo');

    // ตรวจสอบว่าข้อมูลจาก API มีหรือไม่
    accountInfoContainer.innerHTML = `
        <hr style="border: none; height: 6px; background-color: #90b2ae; border-radius: 10px; width: 35%; margin: 0 auto;">
        <style>
            p {
                margin-bottom: 10px; /* เพิ่มช่องว่าง 20px ระหว่างแต่ละย่อหน้า */
            }
        </style>
        <div style="height: 10px;"></div>
        <center><h2>Account Information</h2></center>
         <div style="height: 10px;"></div>
        <p><strong>Username:</strong> ${data.username || 'N/A'}</p>
        <p><strong>Display Name (TH):</strong> ${data.displayname_th || 'N/A'}</p>
        <p><strong>Display Name (EN):</strong> ${data.displayname_en || 'N/A'}</p>
        <p><strong>Type:</strong> ${data.type || 'N/A'}</p>
        <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
        <p><strong>Department:</strong> ${data.department || 'N/A'}</p>
        <p><strong>Faculty:</strong> ${data.faculty || 'N/A'}</p>
        <p><strong>Current Status:</strong> ${data.tu_status || 'N/A'}</p>
    `;

    accountInfoContainer.style.display = 'block';  // แสดงข้อมูลบนหน้าเว็บ
    accountInfoContainer.classList.add('show');    // ใช้ CSS show
}

// ตรวจสอบข้อมูลการล็อกอิน
document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const loginButton = document.getElementById('loginButton');

    function checkInputs() {
        const isUsernameFilled = usernameInput.value.trim() !== '';
        const isPasswordFilled = passwordInput.value.trim() !== '';
        const isRoleSelected = roleSelect.value !== '';

        loginButton.disabled = !(isUsernameFilled && isPasswordFilled && isRoleSelected);
    }

    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
    roleSelect.addEventListener('change', checkInputs);

    checkInputs();
});

// ฟังก์ชัน toggle รหัสผ่าน
function togglePassword() {
    var passwordField = document.getElementById("password");
    var toggleBtn = document.querySelector(".toggle-password");
    
    if (passwordField.type === "password") {
        passwordField.type = "text";  // เปลี่ยนเป็น text เพื่อแสดงรหัสผ่าน
        toggleBtn.textContent = "Hide";  // เปลี่ยนข้อความเป็น Hide
    } else {
        passwordField.type = "password";  // กลับเป็น password เพื่อซ่อนรหัสผ่าน
        toggleBtn.textContent = "Show";  // เปลี่ยนข้อความกลับเป็น Show
    }
}



function call_REST_API_Hello() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const url = (
        'http://localhost:8081/testmicroservice1-0.0.1-SNAPSHOT/hello?' +
        new URLSearchParams({ myName: username, lastName: password}).toString()
      );
    
    fetch(url)
    .then(response => response.text())
    .then(text => {
        console.log("Text return from REST API"+text);
        document.getElementById('message').innerText = text;
    })
    .catch(error => console.error('Error:', error));
}