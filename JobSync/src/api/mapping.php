<?php
include 'dbconnect.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$jobId = isset($_GET['job_id']) ? intval($_GET['job_id']) : 0;

if ($jobId <= 0) {
    die(json_encode(['error' => 'Invalid job ID']));
}

try {
    $sql = "SELECT job_id, address FROM active_job_postings WHERE job_id = :job_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':job_id', $jobId, PDO::PARAM_INT);
    $stmt->execute();
    $addresses = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Query failed: ' . $e->getMessage()]));
}

$apiKey = "AIzaSyAyMtyxzFqO1j5YcTAGgyi-gSbhfyvKWQA";

$geoData = [];

foreach ($addresses as $address) {
    $encodedAddress = urlencode($address["address"] . ", Philippines");
    $url = "https://maps.googleapis.com/maps/api/geocode/json?address=$encodedAddress&key=$apiKey";

    $response = file_get_contents($url);
    $data = json_decode($response, true);

    if ($data["status"] === "OK") {
        $location = $data["results"][0]["geometry"]["location"];
        $geoData[] = [
            "job_id" => $address["job_id"],
            "address" => $address["address"],
            "lat" => $location["lat"],
            "lng" => $location["lng"]
        ];
    }
}

echo json_encode($geoData);
?>
