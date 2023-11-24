/**
 * @swagger
 * tags:
 *   name: Address
 *   description: The address managing API
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         province:
 *           type: string
 *         district:
 *           type: string
 *         commune:
 *           type: string
 *       required:
 *         - province
 *         - district
 *         - commune
 *   responses:
 *     ProductListResponse:
 *       description: A list of products
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 * /api/address:
 *   post:
 *     summary: Create a new address
 *     tags:
 *       - Address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Error connecting to database
 * /api/address/{AccountId}:
 *   get:
 *     summary: Get addresses by Account ID
 *     tags:
 *       - Address
 *     parameters:
 *       - in: path
 *         name: AccountId
 *         description: ID of the account
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ProductListResponse'
 *       404:
 *         description: Address not found
 *       500:
 *         description: Error connecting to the database
 * /api/address/{id}:
 *   put:
 *     summary: Update an address by ID
 *     tags:
 *       - Address
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the address to update
 *         required: true
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: province
 *         description: The province of the address
 *         required: true
 *         schema:
 *           type: string
 *       - in: formData
 *         name: district
 *         description: The district of the address
 *         required: true
 *         schema:
 *           type: string
 *       - in: formData
 *         name: commune
 *         description: The commune of the address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Address not found
 *       500:
 *         description: Error connecting to the database
 *   delete:
 *     summary: Delete an address by ID
 *     tags:
 *      - Address
 *     parameters:
 *      - in: path
 *        name: id
 *        description: ID of the address to delete
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *        '204':
 *          description: Address deleted successfully
 *        '404':
 *          description: Address not found
 *        '500':
 *          description: Error connecting to database
 */

const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const authMidleWare = require("../middleWare/auth.middlewere");
router.get(
  "/address/:AccountId",
  //   authMidleWare.apiAuth,
  addressController.getAccountId
);
router.post("/address", addressController.createAddress);
router.put(
  "/address/:id",
  //   authMidleWare.apiAuth,
  addressController.updateAddress
);
router.delete(
  "/address/:id",
  //   authMidleWare.apiAuth,
  addressController.deleteAddress
);
module.exports = router;
