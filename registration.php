<?php
$Name = $_POST['Uname'];
$Email = $_POST['Email'];
$Password = $_POST['Pass'];
$ConfirmPassword = $_POST['Cpass'];

$conn = new mysqli('localhost','root','','bookrack');
if($conn->connect_error)
{
    echo("conn fail");
}
else
{
    $data = $conn->prepare("insert into registration(Name,Email,Password,ConfirmPassword) values(?,?,?,?)");
    $data->bind_param("ssss",$Name,$Email,$Password,$ConfirmPassword);
    $data->execute();
    echo("Registration succesfully done now you can login now");
    $data->close();
    $conn->close();
}
?>