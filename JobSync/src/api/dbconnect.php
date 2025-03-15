<?php 
if (php_sapi_name() !== 'cli') { 
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY, X-Requested-With");
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit;
    }
}

// Database connection class
class Dbconnect {
    private $server = 'localhost';
    private $dbname = 'db_jobsync';
    private $user = 'root';
    private $pass = '';
    
    public function connect() {
        try {
            $conn = new PDO('mysql:host=' . $this->server . ';dbname=' . $this->dbname, $this->user, $this->pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (\PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            echo json_encode(["error" => "Database connection error."]);
            http_response_code(500); 
            exit; 
        }
    }
}

// FOR HOSTING CONNECTION
// <?php 
// $allowed_origins = [
//     "https://jobsync-ph.com",
//     "https://admin.jobsync-ph.com",
//     "https://mobile.jobsync-ph.com",
// ];

// if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
//     header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
// }
// if (php_sapi_name() !== 'cli') { 
//     header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
//     header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY");
//     header("Access-Control-Allow-Credentials: true");
//     header("Content-Type: application/json");
    
//     if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
//         exit; 
//     }
// }

// // Database connection class with Singleton pattern
// class Dbconnect {
//     private static $instance = null;
//     private $conn;

//     private $server = 'srv961.hstgr.io';
//     private $dbname = 'u998612468_jobsync2';
//     private $user = 'u998612468_jobsync2';
//     private $pass = 'Jobsync123';

//     private function __construct() {
//         try {
//             $options = [
//                 PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
//                 PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
//                 PDO::ATTR_PERSISTENT => true  
//             ];
//             $this->conn = new PDO('mysql:host=' . $this->server . ';dbname=' . $this->dbname, $this->user, $this->pass, $options);
//         } catch (PDOException $e) {
//             error_log("Database Error: " . $e->getMessage());
//             echo json_encode(["error" => "Database connection error."]);
//             http_response_code(500); 
//             exit;
//         }
//     }

//     public static function getInstance() {
//         if (self::$instance === null) {
//             self::$instance = new Dbconnect();
//         }
//         return self::$instance;
//     }

//     public function getConnection() {
//         return $this->conn;
//     }

//     // Optional: Close connection
//     public function closeConnection() {
//         $this->conn = null;
//     }
// }

// // Usage:
// // $db = Dbconnect::getInstance()->getConnection();
// ?>
