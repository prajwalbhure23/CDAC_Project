package com.eventmanagement.resource;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.eventmanagement.dao.PgTransactionDao;
import com.eventmanagement.dto.BookingRequestDto;
import com.eventmanagement.dto.BookingResponseDto;
import com.eventmanagement.dto.CommonApiResponse;
import com.eventmanagement.dto.OrderRazorPayResponse;
import com.eventmanagement.entity.Booking;
import com.eventmanagement.entity.Event;
import com.eventmanagement.entity.PgTransaction;
import com.eventmanagement.entity.User;
import com.eventmanagement.pg.Notes;
import com.eventmanagement.pg.Prefill;
import com.eventmanagement.pg.RazorPayPaymentRequest;
import com.eventmanagement.pg.RazorPayPaymentResponse;
import com.eventmanagement.pg.Theme;
import com.eventmanagement.service.BookingService;
import com.eventmanagement.service.EventService;
import com.eventmanagement.service.UserService;
import com.eventmanagement.utility.Constants.BookingStatus;
import com.eventmanagement.utility.Constants.PaymentGatewayTxnStatus;
import com.eventmanagement.utility.Constants.PaymentGatewayTxnType;
import com.eventmanagement.utility.EmailService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Component
public class BookingResource {

	private final Logger LOG = LoggerFactory.getLogger(EventResource.class);

	@Autowired
	private BookingService bookingService;

	@Autowired
	private UserService userService;

	@Autowired
	private EventService eventService;

	@Autowired
	private PgTransactionDao pgTransactionDao;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private EmailService emailService;

	@Value("${com.eventmanagement.paymentGateway.razorpay.key}")
	private String razorPayKey;

	@Value("${com.eventmanagement.paymentGateway.razorpay.secret}")
	private String razorPaySecret;

	public ResponseEntity<BookingResponseDto> fetchAllBookings() {

		BookingResponseDto response = new BookingResponseDto();

		List<Booking> bookings = this.bookingService.getAllBookings();

		if (CollectionUtils.isEmpty(bookings)) {
			response.setResponseMessage("Bookings not found");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.OK);
		}

		response.setBookings(bookings);
		response.setResponseMessage("Booking fetched successful!!");
		response.setSuccess(true);

		return new ResponseEntity<BookingResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<BookingResponseDto> fetchAllBookingsByEvent(Integer eventId) {

		BookingResponseDto response = new BookingResponseDto();

		if (eventId == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.BAD_REQUEST);

		}

		Event event = this.eventService.getEventById(eventId);

		if (event == null) {
			response.setResponseMessage("event not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Booking> bookings = this.bookingService.getBookingByEvent(event);

		if (CollectionUtils.isEmpty(bookings)) {
			response.setResponseMessage("Bookings not found");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.OK);
		}

		response.setBookings(bookings);
		response.setResponseMessage("Booking fetched successful!!");
		response.setSuccess(true);

		return new ResponseEntity<BookingResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<BookingResponseDto> fetchAllBookingsByCustomer(Integer customerId) {

		BookingResponseDto response = new BookingResponseDto();

		if (customerId == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.BAD_REQUEST);

		}

		User customer = this.userService.getUserById(customerId);

		if (customer == null) {
			response.setResponseMessage("customer not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Booking> bookings = this.bookingService.getBookingByCustomer(customer);

		if (CollectionUtils.isEmpty(bookings)) {
			response.setResponseMessage("Bookings not found");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.OK);
		}

		response.setBookings(bookings);
		response.setResponseMessage("Booking fetched successful!!");
		response.setSuccess(true);

		return new ResponseEntity<BookingResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<BookingResponseDto> fetchAllBookingsByManager(Integer managerId) {

		BookingResponseDto response = new BookingResponseDto();

		if (managerId == null) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.BAD_REQUEST);

		}

		User manager = this.userService.getUserById(managerId);

		if (manager == null) {
			response.setResponseMessage("manager not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Booking> bookings = this.bookingService.getBookingByManager(manager);

		if (CollectionUtils.isEmpty(bookings)) {
			response.setResponseMessage("Bookings not found");
			response.setSuccess(false);

			return new ResponseEntity<BookingResponseDto>(response, HttpStatus.OK);
		}

		response.setBookings(bookings);
		response.setResponseMessage("Booking fetched successful!!");
		response.setSuccess(true);

		return new ResponseEntity<BookingResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<OrderRazorPayResponse> createRazorPayOrder(BookingRequestDto request)
			throws RazorpayException {
		OrderRazorPayResponse response = new OrderRazorPayResponse();

		if (request == null) {
			response.setResponseMessage("bad request - missing input");
			response.setSuccess(false);

			return new ResponseEntity<OrderRazorPayResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User customer = this.userService.getUserById(request.getCustomerId());

		if (customer == null) {
			response.setResponseMessage("Customer Not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<OrderRazorPayResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Event event = this.eventService.getEventById(request.getEventId());

		if (event == null) {
			response.setResponseMessage("Event Not found!!!");
			response.setSuccess(false);

			return new ResponseEntity<OrderRazorPayResponse>(response, HttpStatus.BAD_REQUEST);
		}

		int eventAvailableTickets = event.getAvailableTickets();

		int noOfTicketsToBook = request.getNoOfTickets();

		if (noOfTicketsToBook > eventAvailableTickets) {
			response.setResponseMessage("Only " + eventAvailableTickets + " left for the Event!!!");
			response.setSuccess(false);

			return new ResponseEntity<OrderRazorPayResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String requestTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		BigDecimal totalPrice = BigDecimal.ZERO;

		totalPrice = totalPrice.add(event.getTicketPrice().multiply(BigDecimal.valueOf(request.getNoOfTickets())));

		// write payment gateway code here

		// key : rzp_test_9C5DF9gbJINYTA
		// secret: WYqJeY6CJD1iw7cDZFv1eWl0

		String receiptId = generateUniqueRefId();

		RazorpayClient razorpay = new RazorpayClient(razorPayKey, razorPaySecret);

		JSONObject orderRequest = new JSONObject();
		orderRequest.put("amount", convertRupeesToPaisa(totalPrice));
		orderRequest.put("currency", "INR");
		orderRequest.put("receipt", receiptId);
		JSONObject notes = new JSONObject();
		notes.put("note", "Event Booking Payment - Event Management");
		orderRequest.put("notes", notes);

		Order order = razorpay.orders.create(orderRequest);

		if (order == null) {
			LOG.error("Null Response from RazorPay for creation of Order");
			response.setResponseMessage("Failed to Order the Products");
			response.setSuccess(false);
			return new ResponseEntity<OrderRazorPayResponse>(response, HttpStatus.BAD_REQUEST);
		}

		LOG.info(order.toString()); // printing the response which we got from RazorPay

		String orderId = order.get("id");

		PgTransaction createOrder = new PgTransaction();
		createOrder.setAmount(totalPrice);
		createOrder.setReceiptId(receiptId);
		createOrder.setRequestTime(requestTime);
		createOrder.setType(PaymentGatewayTxnType.CREATE_ORDER.value());
		createOrder.setUser(customer);
		createOrder.setOrderId(orderId); // fetching order id which is created at Razor Pay which we got in response

		if (order.get("status").equals("created")) {
			createOrder.setStatus(PaymentGatewayTxnStatus.SUCCESS.value());
		} else {
			createOrder.setStatus(PaymentGatewayTxnStatus.FAILED.value());
		}

		PgTransaction saveCreateOrderTxn = this.pgTransactionDao.save(createOrder);

		if (saveCreateOrderTxn == null) {
			LOG.error("Failed to save Payment Gateway CReate Order entry in DB");
		}

		PgTransaction payment = new PgTransaction();
		payment.setAmount(totalPrice);
		payment.setReceiptId(receiptId);
		payment.setRequestTime(requestTime);
		payment.setType(PaymentGatewayTxnType.PAYMENT.value());
		payment.setUser(customer);
		payment.setOrderId(orderId); // fetching order id which is created at Razor Pay which we got in response
		payment.setStatus(PaymentGatewayTxnStatus.FAILED.value());
		payment.setEvent(event);
		payment.setTotalTicket(request.getNoOfTickets());
		// from callback api we will actual response from RazorPay, initially keeping it
		// FAILED, once get success response from PG,
		// we will update it

		PgTransaction savePaymentTxn = this.pgTransactionDao.save(payment);

		if (savePaymentTxn == null) {
			LOG.error("Failed to save Payment Gateway Payment entry in DB");
		}

		// Creating RazorPayPaymentRequest to send to Frontend

		RazorPayPaymentRequest razorPayPaymentRequest = new RazorPayPaymentRequest();
		razorPayPaymentRequest.setAmount(convertRupeesToPaisa(totalPrice));
		// razorPayPaymentRequest.setCallbackUrl("http://localhost:8080/pg/razorPay/callBack/response");
		razorPayPaymentRequest.setCurrency("INR");
		razorPayPaymentRequest.setDescription("Event Booking Payment - Event Management");
		razorPayPaymentRequest.setImage(
				"https://image.shutterstock.com/image-photo/image-260nw-631175897.jpg");
		razorPayPaymentRequest.setKey(razorPayKey);
		razorPayPaymentRequest.setName("Event Management System");

		Notes note = new Notes();
		note.setAddress("Dummy Address");

		razorPayPaymentRequest.setNotes(note);
		razorPayPaymentRequest.setOrderId(orderId);

		Prefill prefill = new Prefill();
		prefill.setContact(customer.getPhoneNo());
		prefill.setEmail(customer.getEmailId());
		prefill.setName(customer.getFirstName() + " " + customer.getLastName());

		razorPayPaymentRequest.setPrefill(prefill);

		Theme theme = new Theme();
		theme.setColor("#25493F");

		razorPayPaymentRequest.setTheme(theme);

		try {
			String jsonRequest = objectMapper.writeValueAsString(razorPayPaymentRequest);
			System.out.println("*****************");
			System.out.println(jsonRequest);
			System.out.println("*****************");
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

//				customer.setWalletAmount(existingWalletAmount.add(request.getWalletAmount()));
		//
//				User updatedCustomer = this.userService.updateUser(customer);
		//
//				if (updatedCustomer == null) {
//					response.setResponseMessage("Failed to update the Wallet");
//					response.setSuccess(false);
//					return new ResponseEntity<UserWalletUpdateResponse>(response, HttpStatus.BAD_REQUEST);
//				}

		response.setRazorPayRequest(razorPayPaymentRequest);
		response.setResponseMessage("Payment Order Created Successful!!!");
		response.setSuccess(true);

		return new ResponseEntity<OrderRazorPayResponse>(response, HttpStatus.OK);

	}

	private int convertRupeesToPaisa(BigDecimal rupees) {
		// Multiply the rupees by 100 to get the equivalent in paisa
		BigDecimal paisa = rupees.multiply(new BigDecimal(100));
		return paisa.intValue();
	}

	// for razor pay receipt id
	private String generateUniqueRefId() {
		// Get current timestamp in milliseconds
		long currentTimeMillis = System.currentTimeMillis();

		// Generate a 6-digit UUID (random number)
		String randomDigits = UUID.randomUUID().toString().substring(0, 6);

		// Concatenate timestamp and random digits
		String uniqueRefId = currentTimeMillis + "-" + randomDigits;

		return uniqueRefId;
	}

	public ResponseEntity<CommonApiResponse> handleRazorPayPaymentResponse(RazorPayPaymentResponse razorPayResponse) {

		LOG.info("razor pay response came from frontend");

		CommonApiResponse response = new CommonApiResponse();

		if (razorPayResponse == null || razorPayResponse.getRazorpayOrderId() == null) {
			response.setResponseMessage("Invalid Input response");
			response.setSuccess(false);
			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		PgTransaction paymentTransaction = this.pgTransactionDao
				.findByTypeAndOrderId(PaymentGatewayTxnType.PAYMENT.value(), razorPayResponse.getRazorpayOrderId());

		if (paymentTransaction == null) {
			response.setResponseMessage("Failed to book the event");
			response.setSuccess(false);
			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User customer = paymentTransaction.getUser();

		String razorPayRawResponse = "";
		try {
			razorPayRawResponse = objectMapper.writeValueAsString(razorPayResponse);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		paymentTransaction.setRawResponse(razorPayRawResponse);

		if (razorPayResponse.getError() == null) {
			paymentTransaction.setStatus(PaymentGatewayTxnStatus.SUCCESS.value());
		} else {
			paymentTransaction.setStatus(PaymentGatewayTxnStatus.FAILED.value());
		}

		PgTransaction updatedTransaction = this.pgTransactionDao.save(paymentTransaction);

		if (updatedTransaction.getStatus().equals(PaymentGatewayTxnStatus.FAILED.value())) {
			response.setResponseMessage("Failed tp update the payment transaction");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		} else {
			return bookEvent(paymentTransaction.getEvent(), paymentTransaction.getTotalTicket(),
					paymentTransaction.getUser(), razorPayResponse.getRazorpayOrderId());
		}

	}

	public ResponseEntity<CommonApiResponse> bookEvent(Event event, int totalTicket, User customer,
			String razorPayOrderId) {

		LOG.info("request received for adding customer booking");

		CommonApiResponse response = new CommonApiResponse();

		event = this.eventService.getEventById(event.getId());

		String bookingTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		int eventAvailableTickets = event.getAvailableTickets();

		int noOfTicketsToBook = totalTicket;

		if (noOfTicketsToBook > eventAvailableTickets) {
			response.setResponseMessage("Only " + eventAvailableTickets + " left for the Event!!!");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		BigDecimal eventTicketPrice = event.getTicketPrice();

		BigDecimal totalAmountToPay = eventTicketPrice.multiply(new BigDecimal(noOfTicketsToBook));

		String bookingId = razorPayOrderId;

		Booking booking = new Booking();
		booking.setBookingId(bookingId);
		booking.setAmount(totalAmountToPay);
		booking.setBookingTime(bookingTime);
		booking.setCustomer(customer);
		booking.setEvent(event);
		booking.setNoOfTickets(noOfTicketsToBook);
		booking.setStatus(BookingStatus.CONFIRMED.value());

		Booking savedBooking = this.bookingService.addBooking(booking);

		if (savedBooking == null) {
			response.setResponseMessage("Failed to Book Event, Internal Error");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		event.setAvailableTickets(event.getAvailableTickets() - noOfTicketsToBook);
		this.eventService.updateEvent(event);

		User manager = this.userService.getUserById(event.getManager().getId());
		manager.setWallet(manager.getWallet().add(totalAmountToPay));
		
		this.userService.updateUser(manager);

		String mailBody = sendOrderConfirmationMail(customer, event, noOfTicketsToBook, razorPayOrderId);
		String subject = "Event Management System - Booking Confirmation";

		this.emailService.sendEmail(customer.getEmailId(), subject, mailBody);

		response.setResponseMessage("Your Booking is Confirmed, Booking ID: " + bookingId);
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);

	}

	private String sendOrderConfirmationMail(User customer, Event event, Integer totalTicket, String orderId) {

		StringBuilder emailBody = new StringBuilder();
		emailBody.append("<html><body>");
		emailBody.append("<h3>Dear " + customer.getFirstName() + ",</h3>");
		emailBody.append(
				"<p>Thank you for booking the Event. Your Booking Id is:<span><b>" + orderId + "</b><span></p>");

		emailBody.append("<h3>Booked Event:</h3>");

		// Create a dynamic table for the list of orders
		emailBody.append("<table border='1'>");
		emailBody.append("<tr><th>Event</th><th>Total Ticket</th><th>Total Amount Paid</th></tr>");

		BigDecimal totalPrice = BigDecimal.ZERO;

		totalPrice = totalPrice.add(event.getTicketPrice().multiply(BigDecimal.valueOf(totalTicket)));

		emailBody.append("<tr>");
		emailBody.append("<td>").append(event.getName()).append("</td>");
		emailBody.append("<td>").append(totalTicket).append("</td>");
		emailBody.append("<td>").append(String.valueOf(totalPrice)).append("</td>");
		emailBody.append("</tr>");

		emailBody.append("</table>");

		emailBody.append("<p>Best Regards,<br/>EventVista</p>");

		emailBody.append("</body></html>");

		return emailBody.toString();
	}

}
