async function testQuoteRepository() {
  console.log("🔍 Starting quote repository test...")

  try {
    // Import the quote repository
    const { RedisQuoteRepository } = await import("../repositories/quote-repository")
    const quoteRepo = new RedisQuoteRepository()

    // Test creating a quote
    console.log("\n📝 Creating test quote...")
    const testQuote = await quoteRepo.createQuote({
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      customerPhone: "555-123-4567",
      items: [
        {
          description: "Business Cards - Premium",
          quantity: 500,
          unitPrice: 0.15,
          totalPrice: 75.0,
        },
        {
          description: "Logo Design - Basic",
          quantity: 1,
          unitPrice: 150.0,
          totalPrice: 150.0,
        },
      ],
      subtotal: 225.0,
      tax: 22.5,
      discount: 0,
      total: 247.5,
      status: "pending",
      notes: "Test quote created by integration test",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    })

    console.log("Test quote created:", testQuote.id)

    // Test retrieving a quote
    console.log("\n📝 Retrieving quote...")
    const retrievedQuote = await quoteRepo.getQuoteById(testQuote.id)

    if (retrievedQuote && retrievedQuote.id === testQuote.id) {
      console.log("✅ Quote retrieval test passed!")
      console.log("Retrieved quote:", retrievedQuote)
    } else {
      console.log("❌ Quote retrieval test failed!")
    }

    // Test updating a quote
    console.log("\n📝 Updating quote status...")
    const updatedQuote = await quoteRepo.updateQuoteStatus(testQuote.id, "approved", "Approved by test script")

    if (updatedQuote && updatedQuote.status === "approved") {
      console.log("✅ Quote status update test passed!")
    } else {
      console.log("❌ Quote status update test failed!")
    }

    // Test listing quotes
    console.log("\n📝 Listing quotes...")
    const quotes = await quoteRepo.listQuotes()

    if (quotes.length > 0) {
      console.log(`✅ Found ${quotes.length} quotes`)
    } else {
      console.log("⚠️ No quotes found, but this might be expected in a new environment")
    }

    // Test listing quotes by status
    console.log("\n📝 Listing quotes by status...")
    const approvedQuotes = await quoteRepo.listQuotesByStatus("approved")

    if (approvedQuotes.length > 0) {
      console.log(`✅ Found ${approvedQuotes.length} approved quotes`)
    } else {
      console.log("⚠️ No approved quotes found, but this might be expected")
    }

    // Test converting quote to order
    console.log("\n📝 Converting quote to order...")
    try {
      const { RedisOrderRepository } = await import("../repositories/order-repository")
      const orderRepo = new RedisOrderRepository()

      // Create order from quote
      const order = await orderRepo.createOrder({
        email: retrievedQuote.customerEmail,
        items: retrievedQuote.items.map((item) => ({
          id: `item_${Math.floor(Math.random() * 10000)}`,
          productId: `prod_${Math.floor(Math.random() * 10000)}`,
          variantId: `var_${Math.floor(Math.random() * 10000)}`,
          name: item.description,
          price: item.unitPrice,
          quantity: item.quantity,
        })),
        subtotal: retrievedQuote.subtotal,
        tax: retrievedQuote.tax,
        shipping: 0,
        discount: retrievedQuote.discount,
        total: retrievedQuote.total,
        currency: "USD",
        status: "pending",
        supplierId: "supplier_1",
      })

      console.log("Order created from quote:", order.id)

      // Update quote to reference the order
      const quoteWithOrder = await quoteRepo.updateQuote(retrievedQuote.id, {
        status: "converted",
        orderId: order.id,
        notes: `${retrievedQuote.notes}\nConverted to order ${order.id} by test script`,
      })

      if (quoteWithOrder && quoteWithOrder.orderId === order.id && quoteWithOrder.status === "converted") {
        console.log("✅ Quote to order conversion test passed!")
      } else {
        console.log("❌ Quote to order conversion test failed!")
      }
    } catch (error) {
      console.error("Error converting quote to order:", error)
      console.log("❌ Quote to order conversion test failed!")
    }

    console.log("\n🎉 Quote repository tests completed!")
  } catch (error) {
    console.error("❌ Quote repository test failed with error:", error)
  }
}

// Run the test
testQuoteRepository()
