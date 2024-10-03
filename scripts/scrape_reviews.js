const puppeteer = require("puppeteer");
const Selectors = require("./selectors");

const delay = require("./helpers/delay");
const allReviews = [];
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.amazon.com/Cuckoo-CR-0675F-Cooker-Options-Nonstick/dp/B08WFNV82W/ref=sr_1_1_sspa?_encoding=UTF8&content-id=amzn1.sym.2f889ce0-246f-467a-a086-d9a721167240&dib=eyJ2IjoiMSJ9.5TPDfXXICCcyoAxDl_BD6cgcsvVX-y7ipRxmXO8n37VOUhtKIirHUV0FhlyNQbD5e4AY_GyflOeykOM7WGWIkthNtiOKivU6I1eEhivcGbNXZzRLSntWISCWLQFWRgLZ7jg4ieQ-tpcmxm-tEFWpyv-URB6z3OGtSZxFJaihWbJ4eWiVARGbJG7KbqukF1xZgSubnx1OyNeI26wQgDpC4trKf0DTx3ZRUV_3PfpKejE.zgwDt751VIVXu-ewDRKMG_y1ON5DNmdXyIkzMBy0JSY&dib_tag=se&keywords=cooker&pd_rd_r=8f98d80a-e159-47e0-a88b-2be497c37a38&pd_rd_w=36Gi5&pd_rd_wg=zqSGR&pf_rd_p=2f889ce0-246f-467a-a086-d9a721167240&pf_rd_r=HTQKNJ6K6Y1N75YJKNXX&qid=1727936568&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1"
  );

  // check if there is a see more reviews selector if available then click it
  const isSeeMoreReviews = await page.evaluate(() => {
    if (document.querySelector("#cr-pagination-footer-0 a")) return true;
    return false;
  });

  if (isSeeMoreReviews) await page.click("#cr-pagination-footer-0 a");

  await delay(3);

  // collect reviews available
  const pageReviews = await page.evaluate((Selectors) => {
    const allReviews = [];

    const allReviewsContainers = document.querySelectorAll(
      Selectors.reviewContainer
    );
    for (let i = 0; i < allReviewsContainers.length; i++) {
      const reviewerAvatar = allReviewsContainers[i].querySelector(
        Selectors.reviewerAvatar
      ).src;

      const reviewerName = allReviewsContainers[i]
        .querySelector(Selectors.reviewerName)
        .textContent.trim();

      const rating = allReviewsContainers[i]
        .querySelector(Selectors.rating)
        .textContent.trim()
        .match(/\d+/)[0];
      const reviewText = allReviewsContainers[i]
        .querySelector(Selectors.reviewText)
        .textContent.trim();
      const reviewHelpfulVote =
        allReviewsContainers[i]
          ?.querySelector(Selectors.reviewHelpfulVote)
          ?.textContent.trim()
          ?.match(/\d+/)[0] || "0";

      allReviews.push({
        reviewerAvatar,
        reviewerName,
        rating,
        reviewText,
        reviewHelpfulVote,
      });
    }
    return allReviews;
  }, Selectors);
  allReviews.push(...pageReviews);
  await delay(5);
  console.log(allReviews);
  // check if there is next page then click it
})();
