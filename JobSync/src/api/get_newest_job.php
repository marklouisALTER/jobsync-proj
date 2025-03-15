<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 

    $sql = "SELECT * FROM active_job_postings ORDER BY job_created_at DESC LIMIT 1"; 

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $job = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($job && isset($job['logo']) && !empty($job['logo'])) {
        $job['logo'] = BASE_URL . $job['logo'];
    }

    echo json_encode($job ?: []); 

} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
} finally {
    $conn = null;
}
?>
