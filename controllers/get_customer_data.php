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

    echo json_encode($rs);
?>
