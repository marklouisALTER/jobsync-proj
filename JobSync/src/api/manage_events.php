<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); // This should return a PDO connection
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

try {
    // Update job alerts from 'New' to 'Old' after 1 day
    $sql1 = "UPDATE js_job_alert SET status = 'Old' WHERE status = 'New' AND created_at < NOW() - INTERVAL 1 DAY";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->execute();

    // Delete rejected join requests
    $sql2 = "DELETE FROM js_join_request WHERE status = 'rejected'";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->execute();

    // Delete approved join requests after 15 minutes
    $sql3 = "DELETE FROM js_join_request WHERE status = 'approved' AND approved_at <= NOW() - INTERVAL 15 MINUTE";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->execute();

    // Delete pending join requests after 5 minutes
    $sql4 = "DELETE FROM js_join_request WHERE status = 'pending' AND created_at <= NOW() - INTERVAL 5 MINUTE";
    $stmt4 = $conn->prepare($sql4);
    $stmt4->execute();

    echo json_encode(['success' => true, 'message' => 'Events executed successfully.']);

} catch (PDOException $e) {
    error_log('Query execution failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Query execution failed']);
}

// Close connection (PDO does not require explicit closing)
$conn = null;
?>
