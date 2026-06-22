import { DemoSample } from './types';

export const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'python-flask',
    title: 'Python Flask API',
    language: 'python',
    description: 'A Flask REST API with multiple security issues',
    code: `import sqlite3
import os
import subprocess
from flask import Flask, request, jsonify
import jwt

app = Flask(__name__)
SECRET_KEY = "mysecretkey123"
DB_PASSWORD = "admin123"
API_KEY = "sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"

# Database connection
def get_db():
    conn = sqlite3.connect('users.db')
    return conn

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    # Authenticate user
    conn = get_db()
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    cursor.execute(query)
    user = cursor.fetchone()
    
    if user:
        token = jwt.encode({'user': username}, SECRET_KEY, algorithm='HS256')
        return jsonify({'token': token})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/exec', methods=['POST'])
def execute_command():
    cmd = request.json.get('command')
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return jsonify({'output': result.stdout})

@app.route('/file', methods=['GET'])
def read_file():
    filename = request.args.get('name')
    with open(f"/var/data/{filename}", 'r') as f:
        return f.read()

@app.route('/users', methods=['GET'])
def get_all_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password, ssn, credit_card FROM users")
    users = cursor.fetchall()
    return jsonify({'users': users})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
`
  },
  {
    id: 'javascript-auth',
    title: 'JavaScript Auth Module',
    language: 'javascript',
    description: 'Node.js authentication with broken security controls',
    code: `const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
app.use(express.json());

// Database config - production credentials
const db = mysql.createConnection({
  host: 'prod-db.company.internal',
  user: 'root',
  password: 'P@ssw0rd2024!',
  database: 'users_db'
});

const JWT_SECRET = "hardcoded_jwt_secret_do_not_share";
const ADMIN_KEY = "ADMIN-KEY-1234-ABCD-5678";

// User registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Weak MD5 hashing
  const hashedPwd = crypto.createHash('md5').update(password).digest('hex');
  
  const query = \`INSERT INTO users (username, email, password) 
                 VALUES ('\${username}', '\${email}', '\${hashedPwd}')\`;
  
  db.query(query, (err, result) => {
    if (err) {
      // Exposing database errors to client
      return res.status(500).json({ error: err.message, stack: err.stack });
    }
    res.json({ success: true, userId: result.insertId });
  });
});

// JWT authentication - no expiry set
app.post('/auth/token', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET);
  res.json({ token });
});

// File download - path traversal vulnerable
app.get('/download', (req, res) => {
  const file = req.query.file;
  const filePath = './uploads/' + file;
  res.download(filePath);
});

// Execute user-provided regex (ReDoS)
app.post('/validate', (req, res) => {
  const { pattern, input } = req.body;
  const regex = new RegExp(pattern);
  res.json({ matches: regex.test(input) });
});

app.listen(3000, '0.0.0.0');
console.log('Server running on port 3000');
`
  },
  {
    id: 'sql-stored-procs',
    title: 'SQL Stored Procedures',
    language: 'sql',
    description: 'SQL stored procedures with injection vulnerabilities',
    code: `-- User Authentication Stored Procedure
CREATE PROCEDURE sp_AuthenticateUser
    @username NVARCHAR(50),
    @password NVARCHAR(50)
AS
BEGIN
    -- VULNERABLE: Dynamic SQL without parameterization
    DECLARE @sql NVARCHAR(500)
    SET @sql = 'SELECT user_id, username, role, ssn, credit_card_number 
                FROM users 
                WHERE username = ''' + @username + ''' 
                AND password = ''' + @password + ''''
    
    EXEC(@sql)
END

-- Grant excessive privileges
GRANT EXECUTE ON sp_AuthenticateUser TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO web_user;

-- Stored procedure exposing sensitive data
CREATE PROCEDURE sp_GetUserProfile
    @user_id INT
AS
BEGIN
    -- No authorization check
    SELECT u.username, u.email, u.phone,
           u.ssn,                          -- PII exposure
           u.credit_card_number,           -- PCI data exposure
           u.password_hash,                -- Credential exposure
           a.account_balance,
           l.ip_address, l.user_agent
    FROM users u
    JOIN accounts a ON u.user_id = a.user_id
    JOIN audit_log l ON u.user_id = l.user_id
    WHERE u.user_id = @user_id
END

-- Weak password storage trigger
CREATE TRIGGER tr_HashPassword
ON users
AFTER INSERT
AS
BEGIN
    -- MD5 is cryptographically broken
    UPDATE users 
    SET password_hash = CONVERT(VARCHAR(32), HASHBYTES('MD5', inserted.password), 2)
    FROM users 
    INNER JOIN inserted ON users.user_id = inserted.user_id
END

-- Unrestricted admin procedure
CREATE PROCEDURE sp_AdminQuery
    @query NVARCHAR(MAX)
AS
BEGIN
    -- Arbitrary SQL execution
    EXEC(@query)
END

GRANT EXECUTE ON sp_AdminQuery TO web_role;
`
  }
];

export const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#FF2D55',
  HIGH: '#FF6B2B',
  MEDIUM: '#FFB800',
  LOW: '#00C9A7',
  INFO: '#8B97A8'
};

export const SEVERITY_BG: Record<string, string> = {
  CRITICAL: 'rgba(255, 45, 85, 0.15)',
  HIGH: 'rgba(255, 107, 43, 0.15)',
  MEDIUM: 'rgba(255, 184, 0, 0.12)',
  LOW: 'rgba(0, 201, 167, 0.12)',
  INFO: 'rgba(139, 151, 168, 0.12)'
};

export const CWE_LABELS: Record<string, string> = {
  'CWE-89': 'SQL Injection',
  'CWE-79': 'Cross-Site Scripting',
  'CWE-798': 'Hardcoded Credentials',
  'CWE-78': 'OS Command Injection',
  'CWE-22': 'Path Traversal',
  'CWE-20': 'Improper Input Validation',
  'CWE-327': 'Broken Cryptography',
  'CWE-352': 'CSRF',
  'CWE-918': 'SSRF',
  'CWE-502': 'Insecure Deserialization',
  'CWE-200': 'Info Exposure',
  'CWE-611': 'XXE',
  'CWE-284': 'Improper Access Control',
};
