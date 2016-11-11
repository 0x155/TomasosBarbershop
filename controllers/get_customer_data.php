<?php
    // Need common.php
    require("Connection.php");
    require("../Customer.php");

    // connect() function comes from Connection.php
    $conn = connect();

    $content = $_GET['content'];
    $filter = $_GET['filter'];

    if ($filter === 'number') {
        $rs = Customer::getCustomerInfoByCell($content);
    }
    elseif ($filter === 'name') {
        $rs = Customer::getCustomerInfoByName($content);
    }

    // If one customer is returned, include their visit history as well
    // Also include their first visit date
    if (count($rs) === 1) {
        $returnedCustomer = $rs[0];
        $visitHistory = Customer::getQuickCustomerHistory($returnedCustomer["ID"]);
        $firstVisit = Customer::getVisitDate("first", $returnedCustomer["ID"]);
        $rs[0]["visitHistory"] = $visitHistory;
        $rs[0]["firstVisit"] = $firstVisit;
    }

    echo json_encode($rs);
?>
