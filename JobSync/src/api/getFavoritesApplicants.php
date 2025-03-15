<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $applicant_id = $data['applicant_id'] ?? null;
    $employer_id = $data['employer_id'] ?? null;

    if ($employer_id && $applicant_id) {
        try {
            $stmt = $conn->prepare("SELECT COUNT(*) FROM js_favorite_applicants WHERE employer_id = :employer_id AND applicant_id = :applicant_id");
            $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
            $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
            $stmt->execute();

            $isBookmarked = $stmt->fetchColumn() > 0;

            echo json_encode(['success' => true, 'bookmarked' => $isBookmarked]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required parameters.']);
    }
}
?>
