var Order = require("../models/Order.js");
var auth = require("../middleware/AuthMiddleware.js");
var express = require("express");
const c = require("config");

const router = express.Router();

router.get("/find/:id", (req, res) => {
  const id = req.params.id;
  Order.findById(id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.post("/new", (req, res) => {
  let payload = req.body;

  payload["startTime"] = new Date().getTime();
  payload["phases"] = [
    {
      title: "Corporate Office",
      content: "Sales Content",
      state: "active",
    },
    {
      title: "Design Team",
      content: "Design Content",
      state: "pending",
      nested: [
        {
          title: "Gather data from client",
          content: "gather data",
          state: "pending",
        },
        { title: "Mockup in progress", content: "mockup", state: "pending" },
        {
          title: "Approved by the client",
          content: "approved",
          state: "pending",
        },
      ],
    },
    {
      title: "Factory",
      content: "Manufacturing Team Content",
      state: "pending",
      nested: [
        { title: "Sampling", content: "sampling", state: "pending" },
        { title: "Production", content: "stitching", state: "pending" },
        { title: "Quality & Finishing", content: "printing", state: "pending" },
      ],
    },
    {
      title: "Shipping",
      content: "Shipping Content",
      state: "pending",
    },
  ];

  console.log(`payload= ${payload.quantity}`);

  Order.create(payload, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

router.get("/summary", async (req, res) => {
  let summary = {
    open: 0,
    sampling: 0,
    production: 0,
    closed: 0,
  };
  await Order.find((err, data) => {
    // console.log(
    //   `data= ${JSON.stringify(
    //     data.map((d) => d.orderStatus),
    //     null,
    //     4
    //   )}`
    // );
    if (data)
      data.forEach((row) => {
        row.orderStatus.forEach((st) => {
          if (st === 1) {
            summary.open++;
          } else if (st === 2) {
            summary.sampling++;
          } else if (st === 3) {
            summary.production++;
          } else if (st === 5) {
            summary.closed++;
          }
        });
      });
    // console.log(`summary= ${JSON.stringify(summary, null, 4)}`);
  });

  res.status(200).send(summary);
});

router.get("/all", (req, res) => {
  Order.find((err, data) => {
    console.log(`quantity :: ${data.map((d) => d.quantity)}`);
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.post("/sync/:page", (req, res) => {
  let filter = {};
  let request = req.body;
  if (request.filterBy && request.search) {
    if (request.filterBy != "" && request.search != "") {
      filter[request.filterBy] = { $regex: ".*" + request.search + ".*" };
    }
  }

  if (request.date) {
    if (request.date != "") {
      let time = new Date(request.date).getTime();
      let endTime = time + 86400000;
      filter["startTime"] = { $gte: time, $lt: endTime };
    }
  }
  const page = req.params.page;
  Order.paginate(
    filter,
    { sort: { startTime: -1 }, page: page, limit: 10 },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  Order.deleteOne({ _id: id }, {}, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send("success");
    }
  });
});

router.post("/update/:id", (req, res) => {
  const id = req.params.id;
  Order.updateOne({ _id: id }, req.body, {}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

module.exports = router;
