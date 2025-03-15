<?php
include 'dbconnect.php';
include 'config.php'; 

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()])); 
}

    try {
        $sql = "SELECT * FROM complete_company_profile";
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all rows

        if ($data) {
            foreach ($data as &$company) { 
                if (!empty($company['logo'])) {
                    $company['logo'] = BASE_URL . $company['logo'];
                }
                if (!empty($company['banner'])) {
                    $company['banner'] = BASE_URL . $company['banner'];
                }
            }
            echo json_encode(['data' => $data]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No company profiles found.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database query failed: ' . $e->getMessage()]);
    }


$conn = null;
?>
