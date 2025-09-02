#!/usr/bin/env node
/**
 * Cron job to fetch external listings from Tori.fi and other sources
 * This script should be run periodically to update external listings
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var PrismaClient = require("@prisma/client").PrismaClient;
var _a = require("../../lib/externalListings"), fetchExternalListings = _a.fetchExternalListings, externalListingToBike = _a.externalListingToBike;
var BikeStatus = require("../../types/bicycle").BikeStatus;
var prisma = new PrismaClient();
function fetchForSaleListings() {
    return __awaiter(this, void 0, void 0, function () {
        var listings, newBikesCount, updatedBikesCount, _i, listings_1, listing, convertedBike, existingBike, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting fetchForSale cron job...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 13, 14, 16]);
                    // Fetch external listings
                    console.log("Fetching external listings...");
                    return [4 /*yield*/, fetchExternalListings()];
                case 2:
                    listings = _a.sent();
                    console.log("Fetched ".concat(listings.length, " listings"));
                    newBikesCount = 0;
                    updatedBikesCount = 0;
                    _i = 0, listings_1 = listings;
                    _a.label = 3;
                case 3:
                    if (!(_i < listings_1.length)) return [3 /*break*/, 12];
                    listing = listings_1[_i];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 10, , 11]);
                    convertedBike = externalListingToBike(listing);
                    return [4 /*yield*/, prisma.bike.findFirst({
                            where: {
                                AND: [
                                    { sourceUrl: convertedBike.sourceUrl },
                                    { status: BikeStatus.FOR_SALE_EXTERNAL }
                                ]
                            }
                        })];
                case 5:
                    existingBike = _a.sent();
                    if (!existingBike) return [3 /*break*/, 7];
                    // Update existing bike
                    return [4 /*yield*/, prisma.bike.update({
                            where: { id: existingBike.id },
                            data: {
                                brand: convertedBike.brand,
                                model: convertedBike.model,
                                color: convertedBike.color,
                                city: convertedBike.city,
                                updatedAt: new Date(),
                            }
                        })];
                case 6:
                    // Update existing bike
                    _a.sent();
                    updatedBikesCount++;
                    return [3 /*break*/, 9];
                case 7: 
                // Create new bike
                return [4 /*yield*/, prisma.bike.create({
                        data: {
                            brand: convertedBike.brand,
                            model: convertedBike.model,
                            color: convertedBike.color,
                            status: BikeStatus.FOR_SALE_EXTERNAL,
                            city: convertedBike.city,
                            source: convertedBike.source,
                            sourceUrl: convertedBike.sourceUrl,
                            createdAt: convertedBike.createdAt,
                            updatedAt: convertedBike.updatedAt,
                        }
                    })];
                case 8:
                    // Create new bike
                    _a.sent();
                    newBikesCount++;
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_1 = _a.sent();
                    console.error("Error processing listing ".concat(listing.url, ":"), error_1);
                    return [3 /*break*/, 11];
                case 11:
                    _i++;
                    return [3 /*break*/, 3];
                case 12:
                    console.log("FetchForSale cron job completed. Added ".concat(newBikesCount, " new bikes, updated ").concat(updatedBikesCount, " bikes."));
                    return [3 /*break*/, 16];
                case 13:
                    error_2 = _a.sent();
                    console.error("Error in fetchForSale cron job:", error_2);
                    process.exit(1);
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, prisma.$disconnect()];
                case 15:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
}
// Run the cron job if this file is executed directly
if (require.main === module) {
    fetchForSaleListings().catch(console.error);
}
module.exports = fetchForSaleListings;
