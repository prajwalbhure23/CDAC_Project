package com.eventmanagement.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventmanagement.dto.CommonApiResponse;
import com.eventmanagement.dto.RegisterUserRequestDto;
import com.eventmanagement.dto.ResetPasswordRequestDto;
import com.eventmanagement.dto.UserLoginRequest;
import com.eventmanagement.dto.UserLoginResponse;
import com.eventmanagement.dto.UserResponseDto;
import com.eventmanagement.dto.UserStatusUpdateRequestDto;
import com.eventmanagement.entity.User;
import com.eventmanagement.resource.UserResource;
import com.eventmanagement.service.UserService;
import com.eventmanagement.utility.EmailService;
import com.fasterxml.jackson.core.JsonProcessingException;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	
	@Autowired
	private UserService userService;
	
	@Autowired
	private UserResource userResource;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	private Map<String,String> otpStorage = new HashMap<>();

	// RegisterUserRequestDto, we will set only email, password & role from UI
	@PostMapping("/admin/register")
	@Operation(summary = "Api to register Admin")
	public ResponseEntity<CommonApiResponse> registerAdmin(@RequestBody RegisterUserRequestDto request) {
		return userResource.registerAdmin(request);
	}

	// for customer and manager register
	@PostMapping("register")
	@Operation(summary = "Api to register customer or seller user")
	public ResponseEntity<CommonApiResponse> registerUser(@RequestBody RegisterUserRequestDto request) {
		return this.userResource.registerUser(request);
	}

	@PostMapping("login")
	@Operation(summary = "Api to login any User")
	public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest userLoginRequest) {
		return userResource.login(userLoginRequest);
	}

	@GetMapping("/fetch/role-wise")
	@Operation(summary = "Api to get Users By Role")
	public ResponseEntity<UserResponseDto> fetchAllUsersByRole(@RequestParam("role") String role)
			throws JsonProcessingException {
		return userResource.getUsersByRole(role);
	}

	@PutMapping("update/status")
	@Operation(summary = "Api to update the user status")
	public ResponseEntity<CommonApiResponse> updateUserStatus(@RequestBody UserStatusUpdateRequestDto request) {
		return userResource.updateUserStatus(request);
	}

	@GetMapping("/fetch/user-id")
	@Operation(summary = "Api to get User Detail By User Id")
	public ResponseEntity<UserResponseDto> fetchUserById(@RequestParam("userId") int userId) {
		return userResource.getUserById(userId);
	}
	
	 @PostMapping("/forgot-password")
	    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
	        String email = request.get("email");
	        User user = userService.getUserByEmailid(email);

	        if (user == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                                 .body(Collections.singletonMap("message", "User not found"));
	        }

	        // Generate OTP
	        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
	        otpStorage.put(email, otp);

	        // Send OTP via Email
	        emailService.sendEmail(email, "Password Reset OTP", "Your EventVista password reset OTP is: " + otp);

	        return ResponseEntity.ok(Collections.singletonMap("message", "OTP sent to email"));
	    }
	 
	 @PostMapping("/reset-password")
	 public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequestDto request) {
	     String email = request.getEmailId();
	     String otp = request.getOtp();
	     String newPassword = request.getNewPassword();

	     if (!otpStorage.containsKey(email) || !otpStorage.get(email).equals(otp)) {
	         return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                              .body(Collections.singletonMap("message", "Invalid or expired OTP"));
	     }

	     // Fetch user from database
	     User user = userService.getUserByEmailid(email);
	     if (user == null) {
	         return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                              .body(Collections.singletonMap("message", "User not found"));
	     }

	     // Encrypt the new password before saving
	     String hashedPassword = passwordEncoder.encode(newPassword);
	     user.setPassword(hashedPassword);
	     userService.updateUser(user);

	     // Remove OTP after successful password reset
	     otpStorage.remove(email);

	     return ResponseEntity.ok(Collections.singletonMap("message", "Password updated successfully"));
	 }


}
