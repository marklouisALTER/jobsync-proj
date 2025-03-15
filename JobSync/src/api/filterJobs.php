<?php
include 'dbconnect.php';
include 'config.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

// Get filters from the request
$industry = isset($_GET['industry']) && $_GET['industry'] !== "All Category" ? $_GET['industry'] : "";
$jobType = isset($_GET['jobType']) ? $_GET['jobType'] : "";
$salaryMin = isset($_GET['salaryMin']) ? (int)$_GET['salaryMin'] : 0;
$salaryMax = isset($_GET['salaryMax']) ? (int)$_GET['salaryMax'] : 200000;

$sql = "SELECT j.*, c.industry FROM active_job_postings j
        JOIN js_founding_info c ON j.employer_id = c.employer_id WHERE 1=1";
$params = [];

if (!empty($industry)) {
    $sql .= " AND industry = :industry";
    $params[':industry'] = $industry;
}
if (!empty($jobType)) {
    $sql .= " AND job_type = :jobType";
    $params[':jobType'] = $jobType;
}
if ($salaryMin > 0 || $salaryMax < 200000) {
    $sql .= " AND salary BETWEEN :salaryMin AND :salaryMax";
    $params[':salaryMin'] = $salaryMin;
    $params[':salaryMax'] = $salaryMax;
}

try {
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["jobs" => $jobs]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Query failed: " . $e->getMessage()]);
}
