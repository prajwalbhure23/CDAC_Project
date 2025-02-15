package com.eventmanagement.dto;

import lombok.Data;

@Data
public class ResetPasswordRequestDto {
	
	private String emailId;
	private String otp;
	private String newPassword;

}
