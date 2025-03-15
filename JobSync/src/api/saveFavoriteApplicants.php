<?php
include 'dbconnect.php';

header("Content-Type: application/json");

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
$data = json_decode(file_get_contents('php://input'), true);
$applicant_id = $data['applicant_id'] ?? null;
$employer_id = $data['employer_id'] ?? null;

if (!$applicant_id) { 
    echo json_encode(["success" => false, "message" => "Missing applicant_id"]);
    exit;
}

$checkQuery = "SELECT * FROM js_favorite_applicants WHERE applicant_id = :applicant_id";
$stmt = $conn->prepare($checkQuery);
$stmt->bindParam(":applicant_id", $applicant_id, PDO::PARAM_INT);
$stmt->execute();

if ($stmt->rowCount() > 0) {
    $deleteQuery = "DELETE FROM js_favorite_applicants WHERE applicant_id = :applicant_id";
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->bindParam(":applicant_id", $applicant_id, PDO::PARAM_INT);

    if ($deleteStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Bookmark removed"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to remove bookmark"]);
    }

} else {
    $insertQuery = "INSERT INTO js_favorite_applicants (applicant_id, employer_id) VALUES (:applicant_id, :employer_id)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bindParam(":applicant_id", $applicant_id, PDO::PARAM_INT);
    $insertStmt->bindParam(":employer_id", $employer_id, PDO::PARAM_INT);

    if ($insertStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Bookmark added"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to add bookmark"]);
    }
}
}
?>
