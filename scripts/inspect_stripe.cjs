const Stripe = require('stripe');
const key = process.env.STRIPE_SECRET_KEY;
const envPriceId = process.env.STRIPE_PRICE_ID;
const hardcodedPriceId = 'price_1UESDNCcivqyzGJjAG34QqAK';

console.log('STRIPE_SECRET_KEY present:', Boolean(key));
console.log('process.env.STRIPE_PRICE_ID:', envPriceId);
console.log('Hardcoded fallback Price ID:', hardcodedPriceId);

if (!key) {
  console.log('No STRIPE_SECRET_KEY found!');
  process.exit(0);
}

const stripe = new Stripe(key);

async function inspect() {
  try {
    // 1. Try checking the hardcoded price ID
    console.log('\n=== CHECKING HARDCODED PRICE: ' + hardcodedPriceId + ' ===');
    try {
      const p = await stripe.prices.retrieve(hardcodedPriceId, { expand: ['product'] });
      console.log('Found price details:');
      console.log('  ID:', p.id);
      console.log('  Active:', p.active);
      console.log('  Currency:', p.currency);
      console.log('  Unit Amount:', p.unit_amount, '(= ' + (p.unit_amount / 100) + ' ' + p.currency.toUpperCase() + ')');
      console.log('  Type:', p.type);
      console.log('  Recurring:', p.recurring);
      console.log('  Product:', p.product ? p.product.name : 'none');
    } catch (e) {
      console.log('  Could not retrieve hardcoded price:', e.message);
    }

    // 2. Try checking envPriceId if different
    if (envPriceId && envPriceId !== hardcodedPriceId) {
      console.log('\n=== CHECKING ENV PRICE: ' + envPriceId + ' ===');
      try {
        const p2 = await stripe.prices.retrieve(envPriceId, { expand: ['product'] });
        console.log('Found price details:');
        console.log('  ID:', p2.id);
        console.log('  Active:', p2.active);
        console.log('  Currency:', p2.currency);
        console.log('  Unit Amount:', p2.unit_amount, '(= ' + (p2.unit_amount / 100) + ' ' + p2.currency.toUpperCase() + ')');
        console.log('  Type:', p2.type);
        console.log('  Recurring:', p2.recurring);
        console.log('  Product:', p2.product ? p2.product.name : 'none');
      } catch (e) {
        console.log('  Could not retrieve env price:', e.message);
      }
    }

    // 3. List all prices
    console.log('\n=== ALL PRICES IN STRIPE ACCOUNT ===');
    const prices = await stripe.prices.list({ limit: 50, expand: ['data.product'] });
    console.log('Total prices found:', prices.data.length);
    for (const pr of prices.data) {
      const prodName = pr.product && pr.product.name ? pr.product.name : pr.product;
      console.log('  * Price ID:', pr.id, '| Amount:', (pr.unit_amount / 100), pr.currency.toUpperCase(), '| Type:', pr.type, '| Recurring:', pr.recurring, '| Active:', pr.active, '| Product:', prodName);
    }

    // 4. List all products
    console.log('\n=== ALL PRODUCTS IN STRIPE ACCOUNT ===');
    const prods = await stripe.products.list({ limit: 50 });
    console.log('Total products found:', prods.data.length);
    for (const prd of prods.data) {
      console.log('  * Product ID:', prd.id, '| Name:', prd.name, '| Active:', prd.active, '| Default Price:', prd.default_price);
    }

    // 5. List coupons
    console.log('\n=== ALL COUPONS IN STRIPE ACCOUNT ===');
    const coupons = await stripe.coupons.list({ limit: 50 });
    console.log('Total coupons found:', coupons.data.length);
    for (const c of coupons.data) {
      console.log('  * Coupon ID:', c.id, '| Name:', c.name, '| Percent Off:', c.percent_off, '| Amount Off:', c.amount_off ? (c.amount_off/100) + ' ' + c.currency : null, '| Duration:', c.duration, '| Valid:', c.valid);
    }

    // 6. List promotion codes
    console.log('\n=== ALL PROMOTION CODES IN STRIPE ACCOUNT ===');
    const promos = await stripe.promotionCodes.list({ limit: 50 });
    console.log('Total promotion codes found:', promos.data.length);
    for (const pc of promos.data) {
      console.log('  * Code:', pc.code, '| ID:', pc.id, '| Active:', pc.active, '| Coupon:', pc.coupon ? pc.coupon.id : null, '| Max redemptions:', pc.max_redemptions, '| Times redeemed:', pc.times_redeemed);
    }

  } catch (err) {
    console.error('Fatal inspection error:', err);
  }
}

inspect();
