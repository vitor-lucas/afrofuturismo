function vehicleSteeringRate(speed,steer,wheelbase,wet){const angle=cl(steer,-1,1)*(.52/(1+Math.abs(speed)*.035));return speed/Math.max(1,wheelbase)*Math.tan(angle)*(wet?.75:1);}
function brakeVehicleSpeed(speed,dt,wet){const deceleration=wet?4.2:7;return Math.sign(speed)*Math.max(0,Math.abs(speed)-deceleration*dt);}
