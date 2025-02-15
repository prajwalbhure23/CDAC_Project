package com.eventmanagement.dto;

import lombok.Data;

@Data
public class BookingRequestDto {

	private int eventId;

	private int customerId;

	private int noOfTickets;

}
