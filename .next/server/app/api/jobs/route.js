"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/jobs/route";
exports.ids = ["app/api/jobs/route"];
exports.modules = {

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "module":
/*!*************************!*\
  !*** external "module" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("module");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2Froute&page=%2Fapi%2Fjobs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2Froute.ts&appDir=%2FUsers%2Fsachanakshat%2FDownloads%2FOpenSource%2Fjob-board%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsachanakshat%2FDownloads%2FOpenSource%2Fjob-board&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2Froute&page=%2Fapi%2Fjobs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2Froute.ts&appDir=%2FUsers%2Fsachanakshat%2FDownloads%2FOpenSource%2Fjob-board%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsachanakshat%2FDownloads%2FOpenSource%2Fjob-board&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_sachanakshat_Downloads_OpenSource_job_board_app_api_jobs_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/jobs/route.ts */ \"(rsc)/./app/api/jobs/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/jobs/route\",\n        pathname: \"/api/jobs\",\n        filename: \"route\",\n        bundlePath: \"app/api/jobs/route\"\n    },\n    resolvedPagePath: \"/Users/sachanakshat/Downloads/OpenSource/job-board/app/api/jobs/route.ts\",\n    nextConfigOutput,\n    userland: _Users_sachanakshat_Downloads_OpenSource_job_board_app_api_jobs_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/jobs/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZqb2JzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZqb2JzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGam9icyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnNhY2hhbmFrc2hhdCUyRkRvd25sb2FkcyUyRk9wZW5Tb3VyY2UlMkZqb2ItYm9hcmQlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGc2FjaGFuYWtzaGF0JTJGRG93bmxvYWRzJTJGT3BlblNvdXJjZSUyRmpvYi1ib2FyZCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUN3QjtBQUNyRztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVHQUF1RztBQUMvRztBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzZKOztBQUU3SiIsInNvdXJjZXMiOlsid2VicGFjazovL2pvYi1ib2FyZC1zY3JhcGVyLz80YThkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9zYWNoYW5ha3NoYXQvRG93bmxvYWRzL09wZW5Tb3VyY2Uvam9iLWJvYXJkL2FwcC9hcGkvam9icy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvam9icy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2pvYnNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2pvYnMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvc2FjaGFuYWtzaGF0L0Rvd25sb2Fkcy9PcGVuU291cmNlL2pvYi1ib2FyZC9hcHAvYXBpL2pvYnMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0IH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvam9icy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2Froute&page=%2Fapi%2Fjobs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2Froute.ts&appDir=%2FUsers%2Fsachanakshat%2FDownloads%2FOpenSource%2Fjob-board%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsachanakshat%2FDownloads%2FOpenSource%2Fjob-board&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/jobs/route.ts":
/*!*******************************!*\
  !*** ./app/api/jobs/route.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! uuid */ \"(rsc)/./node_modules/uuid/dist/esm/v4.js\");\n/* harmony import */ var _lib_db_mongodb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db/mongodb */ \"(rsc)/./lib/db/mongodb.ts\");\n/* harmony import */ var _lib_models_Job__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/models/Job */ \"(rsc)/./lib/models/Job.ts\");\n/* harmony import */ var _lib_queue_jobProcessor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/queue/jobProcessor */ \"(rsc)/./lib/queue/jobProcessor.ts\");\n\n\n\n\n\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        const { board, title, limit = 10 } = body;\n        if (!board || !title) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Board and title are required\"\n            }, {\n                status: 400\n            });\n        }\n        await (0,_lib_db_mongodb__WEBPACK_IMPORTED_MODULE_1__.connectDB)();\n        const jobId = (0,uuid__WEBPACK_IMPORTED_MODULE_4__[\"default\"])();\n        const job = new _lib_models_Job__WEBPACK_IMPORTED_MODULE_2__.Job({\n            jobId,\n            status: \"pending\",\n            board,\n            title,\n            limit,\n            createdAt: new Date(),\n            updatedAt: new Date()\n        });\n        await job.save();\n        // Add job to queue\n        await _lib_queue_jobProcessor__WEBPACK_IMPORTED_MODULE_3__.jobQueue.add(\"scrape\", {\n            jobId,\n            board,\n            title,\n            limit\n        });\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            jobId\n        });\n    } catch (error) {\n        console.error(\"Error creating job:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Failed to create job\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function GET(request) {\n    try {\n        await (0,_lib_db_mongodb__WEBPACK_IMPORTED_MODULE_1__.connectDB)();\n        const jobs = await _lib_models_Job__WEBPACK_IMPORTED_MODULE_2__.Job.find().sort({\n            createdAt: -1\n        });\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json(jobs);\n    } catch (error) {\n        console.error(\"Error fetching jobs:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Failed to fetch jobs\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2pvYnMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUEyQztBQUNQO0FBQ1M7QUFDTjtBQUNhO0FBRTdDLGVBQWVNLEtBQUtDLE9BQWdCO0lBQ3pDLElBQUk7UUFDRixNQUFNQyxPQUFPLE1BQU1ELFFBQVFFLElBQUk7UUFDL0IsTUFBTSxFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRUMsUUFBUSxFQUFFLEVBQUUsR0FBR0o7UUFFckMsSUFBSSxDQUFDRSxTQUFTLENBQUNDLE9BQU87WUFDcEIsT0FBT1gsa0ZBQVlBLENBQUNTLElBQUksQ0FDdEI7Z0JBQUVJLE9BQU87WUFBK0IsR0FDeEM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLE1BQU1YLDBEQUFTQTtRQUVmLE1BQU1ZLFFBQVFiLGdEQUFNQTtRQUNwQixNQUFNYyxNQUFNLElBQUlaLGdEQUFHQSxDQUFDO1lBQ2xCVztZQUNBRCxRQUFRO1lBQ1JKO1lBQ0FDO1lBQ0FDO1lBQ0FLLFdBQVcsSUFBSUM7WUFDZkMsV0FBVyxJQUFJRDtRQUNqQjtRQUVBLE1BQU1GLElBQUlJLElBQUk7UUFFZCxtQkFBbUI7UUFDbkIsTUFBTWYsNkRBQVFBLENBQUNnQixHQUFHLENBQUMsVUFBVTtZQUMzQk47WUFDQUw7WUFDQUM7WUFDQUM7UUFDRjtRQUVBLE9BQU9aLGtGQUFZQSxDQUFDUyxJQUFJLENBQUM7WUFBRU07UUFBTTtJQUNuQyxFQUFFLE9BQU9GLE9BQU87UUFDZFMsUUFBUVQsS0FBSyxDQUFDLHVCQUF1QkE7UUFDckMsT0FBT2Isa0ZBQVlBLENBQUNTLElBQUksQ0FDdEI7WUFBRUksT0FBTztRQUF1QixHQUNoQztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRjtBQUVPLGVBQWVTLElBQUloQixPQUFnQjtJQUN4QyxJQUFJO1FBQ0YsTUFBTUosMERBQVNBO1FBQ2YsTUFBTXFCLE9BQU8sTUFBTXBCLGdEQUFHQSxDQUFDcUIsSUFBSSxHQUFHQyxJQUFJLENBQUM7WUFBRVQsV0FBVyxDQUFDO1FBQUU7UUFDbkQsT0FBT2pCLGtGQUFZQSxDQUFDUyxJQUFJLENBQUNlO0lBQzNCLEVBQUUsT0FBT1gsT0FBTztRQUNkUyxRQUFRVCxLQUFLLENBQUMsd0JBQXdCQTtRQUN0QyxPQUFPYixrRkFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtZQUFFSSxPQUFPO1FBQXVCLEdBQ2hDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vam9iLWJvYXJkLXNjcmFwZXIvLi9hcHAvYXBpL2pvYnMvcm91dGUudHM/OWU3OCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyB2NCBhcyB1dWlkdjQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IGNvbm5lY3REQiB9IGZyb20gJ0AvbGliL2RiL21vbmdvZGInO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnQC9saWIvbW9kZWxzL0pvYic7XG5pbXBvcnQgeyBqb2JRdWV1ZSB9IGZyb20gJ0AvbGliL3F1ZXVlL2pvYlByb2Nlc3Nvcic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG4gICAgY29uc3QgeyBib2FyZCwgdGl0bGUsIGxpbWl0ID0gMTAgfSA9IGJvZHk7XG5cbiAgICBpZiAoIWJvYXJkIHx8ICF0aXRsZSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnQm9hcmQgYW5kIHRpdGxlIGFyZSByZXF1aXJlZCcgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIGF3YWl0IGNvbm5lY3REQigpO1xuXG4gICAgY29uc3Qgam9iSWQgPSB1dWlkdjQoKTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKHtcbiAgICAgIGpvYklkLFxuICAgICAgc3RhdHVzOiAncGVuZGluZycsXG4gICAgICBib2FyZCxcbiAgICAgIHRpdGxlLFxuICAgICAgbGltaXQsXG4gICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXG4gICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKClcbiAgICB9KTtcblxuICAgIGF3YWl0IGpvYi5zYXZlKCk7XG5cbiAgICAvLyBBZGQgam9iIHRvIHF1ZXVlXG4gICAgYXdhaXQgam9iUXVldWUuYWRkKCdzY3JhcGUnLCB7XG4gICAgICBqb2JJZCxcbiAgICAgIGJvYXJkLFxuICAgICAgdGl0bGUsXG4gICAgICBsaW1pdFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgam9iSWQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgam9iOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGNyZWF0ZSBqb2InIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGF3YWl0IGNvbm5lY3REQigpO1xuICAgIGNvbnN0IGpvYnMgPSBhd2FpdCBKb2IuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihqb2JzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBqb2JzOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiAnRmFpbGVkIHRvIGZldGNoIGpvYnMnIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59ICJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJ2NCIsInV1aWR2NCIsImNvbm5lY3REQiIsIkpvYiIsImpvYlF1ZXVlIiwiUE9TVCIsInJlcXVlc3QiLCJib2R5IiwianNvbiIsImJvYXJkIiwidGl0bGUiLCJsaW1pdCIsImVycm9yIiwic3RhdHVzIiwiam9iSWQiLCJqb2IiLCJjcmVhdGVkQXQiLCJEYXRlIiwidXBkYXRlZEF0Iiwic2F2ZSIsImFkZCIsImNvbnNvbGUiLCJHRVQiLCJqb2JzIiwiZmluZCIsInNvcnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/jobs/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db/mongodb.ts":
/*!***************************!*\
  !*** ./lib/db/mongodb.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectDB: () => (/* binding */ connectDB),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nif (!process.env.MONGODB_CONNECTION_STRING) {\n    throw new Error(\"Please define the MONGODB_CONNECTION_STRING environment variable\");\n}\nconst MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;\nlet cached = global.mongoose;\nif (!cached) {\n    cached = global.mongoose = {\n        conn: null,\n        promise: null\n    };\n}\nasync function connectDB() {\n    if (cached.conn) {\n        return cached.conn;\n    }\n    if (!cached.promise) {\n        const opts = {\n            bufferCommands: false\n        };\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, opts);\n    }\n    try {\n        cached.conn = await cached.promise;\n    } catch (e) {\n        cached.promise = null;\n        throw e;\n    }\n    return cached.conn;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectDB);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIvbW9uZ29kYi50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQWdDO0FBU2hDLElBQUksQ0FBQ0MsUUFBUUMsR0FBRyxDQUFDQyx5QkFBeUIsRUFBRTtJQUMxQyxNQUFNLElBQUlDLE1BQU07QUFDbEI7QUFFQSxNQUFNQyxjQUFjSixRQUFRQyxHQUFHLENBQUNDLHlCQUF5QjtBQUV6RCxJQUFJRyxTQUFTQyxPQUFPUCxRQUFRO0FBRTVCLElBQUksQ0FBQ00sUUFBUTtJQUNYQSxTQUFTQyxPQUFPUCxRQUFRLEdBQUc7UUFBRVEsTUFBTTtRQUFNQyxTQUFTO0lBQUs7QUFDekQ7QUFFTyxlQUFlQztJQUNwQixJQUFJSixPQUFPRSxJQUFJLEVBQUU7UUFDZixPQUFPRixPQUFPRSxJQUFJO0lBQ3BCO0lBRUEsSUFBSSxDQUFDRixPQUFPRyxPQUFPLEVBQUU7UUFDbkIsTUFBTUUsT0FBTztZQUNYQyxnQkFBZ0I7UUFDbEI7UUFFQU4sT0FBT0csT0FBTyxHQUFHVCx1REFBZ0IsQ0FBQ0ssYUFBYU07SUFDakQ7SUFFQSxJQUFJO1FBQ0ZMLE9BQU9FLElBQUksR0FBRyxNQUFNRixPQUFPRyxPQUFPO0lBQ3BDLEVBQUUsT0FBT0ssR0FBRztRQUNWUixPQUFPRyxPQUFPLEdBQUc7UUFDakIsTUFBTUs7SUFDUjtJQUVBLE9BQU9SLE9BQU9FLElBQUk7QUFDcEI7QUFFQSxpRUFBZUUsU0FBU0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2pvYi1ib2FyZC1zY3JhcGVyLy4vbGliL2RiL21vbmdvZGIudHM/NmU4YiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIHZhciBtb25nb29zZToge1xuICAgIGNvbm46IHR5cGVvZiBtb25nb29zZSB8IG51bGw7XG4gICAgcHJvbWlzZTogUHJvbWlzZTx0eXBlb2YgbW9uZ29vc2U+IHwgbnVsbDtcbiAgfTtcbn1cblxuaWYgKCFwcm9jZXNzLmVudi5NT05HT0RCX0NPTk5FQ1RJT05fU1RSSU5HKSB7XG4gIHRocm93IG5ldyBFcnJvcignUGxlYXNlIGRlZmluZSB0aGUgTU9OR09EQl9DT05ORUNUSU9OX1NUUklORyBlbnZpcm9ubWVudCB2YXJpYWJsZScpO1xufVxuXG5jb25zdCBNT05HT0RCX1VSSSA9IHByb2Nlc3MuZW52Lk1PTkdPREJfQ09OTkVDVElPTl9TVFJJTkc7XG5cbmxldCBjYWNoZWQgPSBnbG9iYWwubW9uZ29vc2U7XG5cbmlmICghY2FjaGVkKSB7XG4gIGNhY2hlZCA9IGdsb2JhbC5tb25nb29zZSA9IHsgY29ubjogbnVsbCwgcHJvbWlzZTogbnVsbCB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29ubmVjdERCKCk6IFByb21pc2U8dHlwZW9mIG1vbmdvb3NlPiB7XG4gIGlmIChjYWNoZWQuY29ubikge1xuICAgIHJldHVybiBjYWNoZWQuY29ubjtcbiAgfVxuXG4gIGlmICghY2FjaGVkLnByb21pc2UpIHtcbiAgICBjb25zdCBvcHRzID0ge1xuICAgICAgYnVmZmVyQ29tbWFuZHM6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjYWNoZWQucHJvbWlzZSA9IG1vbmdvb3NlLmNvbm5lY3QoTU9OR09EQl9VUkksIG9wdHMpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjYWNoZWQuY29ubiA9IGF3YWl0IGNhY2hlZC5wcm9taXNlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY2FjaGVkLnByb21pc2UgPSBudWxsO1xuICAgIHRocm93IGU7XG4gIH1cblxuICByZXR1cm4gY2FjaGVkLmNvbm47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3REQjsgIl0sIm5hbWVzIjpbIm1vbmdvb3NlIiwicHJvY2VzcyIsImVudiIsIk1PTkdPREJfQ09OTkVDVElPTl9TVFJJTkciLCJFcnJvciIsIk1PTkdPREJfVVJJIiwiY2FjaGVkIiwiZ2xvYmFsIiwiY29ubiIsInByb21pc2UiLCJjb25uZWN0REIiLCJvcHRzIiwiYnVmZmVyQ29tbWFuZHMiLCJjb25uZWN0IiwiZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db/mongodb.ts\n");

/***/ }),

/***/ "(rsc)/./lib/models/Job.ts":
/*!***************************!*\
  !*** ./lib/models/Job.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Job: () => (/* binding */ Job)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst jobSchema = new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({\n    jobId: {\n        type: String,\n        required: true,\n        unique: true\n    },\n    status: {\n        type: String,\n        enum: [\n            \"pending\",\n            \"processing\",\n            \"completed\",\n            \"failed\"\n        ],\n        required: true\n    },\n    board: {\n        type: String,\n        required: true\n    },\n    title: {\n        type: String,\n        required: true\n    },\n    limit: {\n        type: Number,\n        required: true\n    },\n    result: {\n        type: (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema).Types.Mixed\n    },\n    error: {\n        type: String\n    },\n    createdAt: {\n        type: Date,\n        required: true\n    },\n    updatedAt: {\n        type: Date,\n        required: true\n    }\n});\nconst Job = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().models).Job || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model(\"Job\", jobSchema);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbW9kZWxzL0pvYi50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBZ0M7QUFjaEMsTUFBTUMsWUFBWSxJQUFJRCx3REFBZSxDQUFPO0lBQzFDRyxPQUFPO1FBQUVDLE1BQU1DO1FBQVFDLFVBQVU7UUFBTUMsUUFBUTtJQUFLO0lBQ3BEQyxRQUFRO1FBQ05KLE1BQU1DO1FBQ05JLE1BQU07WUFBQztZQUFXO1lBQWM7WUFBYTtTQUFTO1FBQ3RESCxVQUFVO0lBQ1o7SUFDQUksT0FBTztRQUFFTixNQUFNQztRQUFRQyxVQUFVO0lBQUs7SUFDdENLLE9BQU87UUFBRVAsTUFBTUM7UUFBUUMsVUFBVTtJQUFLO0lBQ3RDTSxPQUFPO1FBQUVSLE1BQU1TO1FBQVFQLFVBQVU7SUFBSztJQUN0Q1EsUUFBUTtRQUFFVixNQUFNSix3REFBZSxDQUFDZSxLQUFLLENBQUNDLEtBQUs7SUFBQztJQUM1Q0MsT0FBTztRQUFFYixNQUFNQztJQUFPO0lBQ3RCYSxXQUFXO1FBQUVkLE1BQU1lO1FBQU1iLFVBQVU7SUFBSztJQUN4Q2MsV0FBVztRQUFFaEIsTUFBTWU7UUFBTWIsVUFBVTtJQUFLO0FBQzFDO0FBRU8sTUFBTWUsTUFBTXJCLHdEQUFlLENBQUNxQixHQUFHLElBQUlyQixxREFBYyxDQUFPLE9BQU9DLFdBQVciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qb2ItYm9hcmQtc2NyYXBlci8uL2xpYi9tb2RlbHMvSm9iLnRzPzk3MWIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcblxuZXhwb3J0IGludGVyZmFjZSBJSm9iIHtcbiAgam9iSWQ6IHN0cmluZztcbiAgc3RhdHVzOiAncGVuZGluZycgfCAncHJvY2Vzc2luZycgfCAnY29tcGxldGVkJyB8ICdmYWlsZWQnO1xuICBib2FyZDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBsaW1pdDogbnVtYmVyO1xuICByZXN1bHQ/OiBhbnk7XG4gIGVycm9yPzogc3RyaW5nO1xuICBjcmVhdGVkQXQ6IERhdGU7XG4gIHVwZGF0ZWRBdDogRGF0ZTtcbn1cblxuY29uc3Qgam9iU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYTxJSm9iPih7XG4gIGpvYklkOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZSB9LFxuICBzdGF0dXM6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZW51bTogWydwZW5kaW5nJywgJ3Byb2Nlc3NpbmcnLCAnY29tcGxldGVkJywgJ2ZhaWxlZCddLFxuICAgIHJlcXVpcmVkOiB0cnVlXG4gIH0sXG4gIGJvYXJkOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgdGl0bGU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxuICBsaW1pdDogeyB0eXBlOiBOdW1iZXIsIHJlcXVpcmVkOiB0cnVlIH0sXG4gIHJlc3VsdDogeyB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuTWl4ZWQgfSxcbiAgZXJyb3I6IHsgdHlwZTogU3RyaW5nIH0sXG4gIGNyZWF0ZWRBdDogeyB0eXBlOiBEYXRlLCByZXF1aXJlZDogdHJ1ZSB9LFxuICB1cGRhdGVkQXQ6IHsgdHlwZTogRGF0ZSwgcmVxdWlyZWQ6IHRydWUgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBKb2IgPSBtb25nb29zZS5tb2RlbHMuSm9iIHx8IG1vbmdvb3NlLm1vZGVsPElKb2I+KCdKb2InLCBqb2JTY2hlbWEpOyAiXSwibmFtZXMiOlsibW9uZ29vc2UiLCJqb2JTY2hlbWEiLCJTY2hlbWEiLCJqb2JJZCIsInR5cGUiLCJTdHJpbmciLCJyZXF1aXJlZCIsInVuaXF1ZSIsInN0YXR1cyIsImVudW0iLCJib2FyZCIsInRpdGxlIiwibGltaXQiLCJOdW1iZXIiLCJyZXN1bHQiLCJUeXBlcyIsIk1peGVkIiwiZXJyb3IiLCJjcmVhdGVkQXQiLCJEYXRlIiwidXBkYXRlZEF0IiwiSm9iIiwibW9kZWxzIiwibW9kZWwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/models/Job.ts\n");

/***/ }),

/***/ "(rsc)/./lib/queue/jobProcessor.ts":
/*!***********************************!*\
  !*** ./lib/queue/jobProcessor.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   jobQueue: () => (/* binding */ jobQueue)\n/* harmony export */ });\n/* harmony import */ var bull__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bull */ \"(rsc)/./node_modules/bull/index.js\");\n/* harmony import */ var bull__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bull__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_db_mongodb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db/mongodb */ \"(rsc)/./lib/db/mongodb.ts\");\n/* harmony import */ var _lib_models_Job__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/models/Job */ \"(rsc)/./lib/models/Job.ts\");\n/* harmony import */ var _lib_scrapers_remoteok__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/scrapers/remoteok */ \"(rsc)/./lib/scrapers/remoteok.ts\");\n\n\n\n\n// Create a new queue\nconst jobQueue = new (bull__WEBPACK_IMPORTED_MODULE_0___default())(\"job-queue\", {\n    redis: {\n        host: \"localhost\",\n        port: 6379\n    }\n});\n// Process jobs\njobQueue.process(\"scrape\", async (job)=>{\n    const { jobId, board, title, limit } = job.data;\n    try {\n        await (0,_lib_db_mongodb__WEBPACK_IMPORTED_MODULE_1__.connectDB)();\n        const jobDoc = await _lib_models_Job__WEBPACK_IMPORTED_MODULE_2__.Job.findOne({\n            jobId\n        });\n        if (!jobDoc) {\n            throw new Error(\"Job not found\");\n        }\n        // Update job status to processing\n        jobDoc.status = \"processing\";\n        jobDoc.updatedAt = new Date();\n        await jobDoc.save();\n        // Scrape jobs based on board\n        let results;\n        switch(board.toLowerCase()){\n            case \"remoteok\":\n                results = await (0,_lib_scrapers_remoteok__WEBPACK_IMPORTED_MODULE_3__.scrapeRemoteOK)(title, limit);\n                break;\n            default:\n                throw new Error(`Unsupported board: ${board}`);\n        }\n        // Update job with results\n        jobDoc.status = \"completed\";\n        jobDoc.result = results;\n        jobDoc.updatedAt = new Date();\n        await jobDoc.save();\n        return results;\n    } catch (error) {\n        console.error(\"Error processing job:\", error);\n        // Update job with error\n        const jobDoc = await _lib_models_Job__WEBPACK_IMPORTED_MODULE_2__.Job.findOne({\n            jobId\n        });\n        if (jobDoc) {\n            jobDoc.status = \"failed\";\n            jobDoc.error = error instanceof Error ? error.message : \"Unknown error\";\n            jobDoc.updatedAt = new Date();\n            await jobDoc.save();\n        }\n        throw error;\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcXVldWUvam9iUHJvY2Vzc29yLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUF5QjtBQUNvQjtBQUNOO0FBQ2tCO0FBRXpELHFCQUFxQjtBQUNkLE1BQU1JLFdBQVcsSUFBSUosNkNBQUtBLENBQUMsYUFBYTtJQUM3Q0ssT0FBTztRQUNMQyxNQUFNO1FBQ05DLE1BQU07SUFDUjtBQUNGLEdBQUc7QUFFSCxlQUFlO0FBQ2ZILFNBQVNJLE9BQU8sQ0FBQyxVQUFVLE9BQU9DO0lBQ2hDLE1BQU0sRUFBRUMsS0FBSyxFQUFFQyxLQUFLLEVBQUVDLEtBQUssRUFBRUMsS0FBSyxFQUFFLEdBQUdKLElBQUlLLElBQUk7SUFFL0MsSUFBSTtRQUNGLE1BQU1iLDBEQUFTQTtRQUNmLE1BQU1jLFNBQVMsTUFBTWIsZ0RBQUdBLENBQUNjLE9BQU8sQ0FBQztZQUFFTjtRQUFNO1FBRXpDLElBQUksQ0FBQ0ssUUFBUTtZQUNYLE1BQU0sSUFBSUUsTUFBTTtRQUNsQjtRQUVBLGtDQUFrQztRQUNsQ0YsT0FBT0csTUFBTSxHQUFHO1FBQ2hCSCxPQUFPSSxTQUFTLEdBQUcsSUFBSUM7UUFDdkIsTUFBTUwsT0FBT00sSUFBSTtRQUVqQiw2QkFBNkI7UUFDN0IsSUFBSUM7UUFDSixPQUFRWCxNQUFNWSxXQUFXO1lBQ3ZCLEtBQUs7Z0JBQ0hELFVBQVUsTUFBTW5CLHNFQUFjQSxDQUFDUyxPQUFPQztnQkFDdEM7WUFDRjtnQkFDRSxNQUFNLElBQUlJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRU4sTUFBTSxDQUFDO1FBQ2pEO1FBRUEsMEJBQTBCO1FBQzFCSSxPQUFPRyxNQUFNLEdBQUc7UUFDaEJILE9BQU9TLE1BQU0sR0FBR0Y7UUFDaEJQLE9BQU9JLFNBQVMsR0FBRyxJQUFJQztRQUN2QixNQUFNTCxPQUFPTSxJQUFJO1FBRWpCLE9BQU9DO0lBQ1QsRUFBRSxPQUFPRyxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyx5QkFBeUJBO1FBRXZDLHdCQUF3QjtRQUN4QixNQUFNVixTQUFTLE1BQU1iLGdEQUFHQSxDQUFDYyxPQUFPLENBQUM7WUFBRU47UUFBTTtRQUN6QyxJQUFJSyxRQUFRO1lBQ1ZBLE9BQU9HLE1BQU0sR0FBRztZQUNoQkgsT0FBT1UsS0FBSyxHQUFHQSxpQkFBaUJSLFFBQVFRLE1BQU1FLE9BQU8sR0FBRztZQUN4RFosT0FBT0ksU0FBUyxHQUFHLElBQUlDO1lBQ3ZCLE1BQU1MLE9BQU9NLElBQUk7UUFDbkI7UUFFQSxNQUFNSTtJQUNSO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qb2ItYm9hcmQtc2NyYXBlci8uL2xpYi9xdWV1ZS9qb2JQcm9jZXNzb3IudHM/ZDMzOSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUXVldWUgZnJvbSAnYnVsbCc7XG5pbXBvcnQgeyBjb25uZWN0REIgfSBmcm9tICdAL2xpYi9kYi9tb25nb2RiJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ0AvbGliL21vZGVscy9Kb2InO1xuaW1wb3J0IHsgc2NyYXBlUmVtb3RlT0sgfSBmcm9tICdAL2xpYi9zY3JhcGVycy9yZW1vdGVvayc7XG5cbi8vIENyZWF0ZSBhIG5ldyBxdWV1ZVxuZXhwb3J0IGNvbnN0IGpvYlF1ZXVlID0gbmV3IFF1ZXVlKCdqb2ItcXVldWUnLCB7XG4gIHJlZGlzOiB7XG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgcG9ydDogNjM3OVxuICB9XG59KTtcblxuLy8gUHJvY2VzcyBqb2JzXG5qb2JRdWV1ZS5wcm9jZXNzKCdzY3JhcGUnLCBhc3luYyAoam9iKSA9PiB7XG4gIGNvbnN0IHsgam9iSWQsIGJvYXJkLCB0aXRsZSwgbGltaXQgfSA9IGpvYi5kYXRhO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgY29ubmVjdERCKCk7XG4gICAgY29uc3Qgam9iRG9jID0gYXdhaXQgSm9iLmZpbmRPbmUoeyBqb2JJZCB9KTtcblxuICAgIGlmICgham9iRG9jKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0pvYiBub3QgZm91bmQnKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgam9iIHN0YXR1cyB0byBwcm9jZXNzaW5nXG4gICAgam9iRG9jLnN0YXR1cyA9ICdwcm9jZXNzaW5nJztcbiAgICBqb2JEb2MudXBkYXRlZEF0ID0gbmV3IERhdGUoKTtcbiAgICBhd2FpdCBqb2JEb2Muc2F2ZSgpO1xuXG4gICAgLy8gU2NyYXBlIGpvYnMgYmFzZWQgb24gYm9hcmRcbiAgICBsZXQgcmVzdWx0cztcbiAgICBzd2l0Y2ggKGJvYXJkLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgIGNhc2UgJ3JlbW90ZW9rJzpcbiAgICAgICAgcmVzdWx0cyA9IGF3YWl0IHNjcmFwZVJlbW90ZU9LKHRpdGxlLCBsaW1pdCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBib2FyZDogJHtib2FyZH1gKTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgam9iIHdpdGggcmVzdWx0c1xuICAgIGpvYkRvYy5zdGF0dXMgPSAnY29tcGxldGVkJztcbiAgICBqb2JEb2MucmVzdWx0ID0gcmVzdWx0cztcbiAgICBqb2JEb2MudXBkYXRlZEF0ID0gbmV3IERhdGUoKTtcbiAgICBhd2FpdCBqb2JEb2Muc2F2ZSgpO1xuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgcHJvY2Vzc2luZyBqb2I6JywgZXJyb3IpO1xuXG4gICAgLy8gVXBkYXRlIGpvYiB3aXRoIGVycm9yXG4gICAgY29uc3Qgam9iRG9jID0gYXdhaXQgSm9iLmZpbmRPbmUoeyBqb2JJZCB9KTtcbiAgICBpZiAoam9iRG9jKSB7XG4gICAgICBqb2JEb2Muc3RhdHVzID0gJ2ZhaWxlZCc7XG4gICAgICBqb2JEb2MuZXJyb3IgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJztcbiAgICAgIGpvYkRvYy51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpO1xuICAgICAgYXdhaXQgam9iRG9jLnNhdmUoKTtcbiAgICB9XG5cbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufSk7ICJdLCJuYW1lcyI6WyJRdWV1ZSIsImNvbm5lY3REQiIsIkpvYiIsInNjcmFwZVJlbW90ZU9LIiwiam9iUXVldWUiLCJyZWRpcyIsImhvc3QiLCJwb3J0IiwicHJvY2VzcyIsImpvYiIsImpvYklkIiwiYm9hcmQiLCJ0aXRsZSIsImxpbWl0IiwiZGF0YSIsImpvYkRvYyIsImZpbmRPbmUiLCJFcnJvciIsInN0YXR1cyIsInVwZGF0ZWRBdCIsIkRhdGUiLCJzYXZlIiwicmVzdWx0cyIsInRvTG93ZXJDYXNlIiwicmVzdWx0IiwiZXJyb3IiLCJjb25zb2xlIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/queue/jobProcessor.ts\n");

/***/ }),

/***/ "(rsc)/./lib/scrapers/remoteok.ts":
/*!**********************************!*\
  !*** ./lib/scrapers/remoteok.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   scrapeRemoteOK: () => (/* binding */ scrapeRemoteOK)\n/* harmony export */ });\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ \"(rsc)/./node_modules/axios/lib/axios.js\");\n\nasync function scrapeRemoteOK(title, limit = 10) {\n    try {\n        const response = await axios__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get(\"https://remoteok.io/api\", {\n            headers: {\n                \"User-Agent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\"\n            }\n        });\n        const jobs = [];\n        const apiJobs = response.data.slice(1); // First item is a notice\n        for (const apiJob of apiJobs){\n            if (jobs.length >= limit) break;\n            const jobTitle = apiJob.position;\n            if (jobTitle.toLowerCase().includes(title.toLowerCase())) {\n                const job = {\n                    jobId: apiJob.id.toString(),\n                    position: jobTitle,\n                    company: apiJob.company,\n                    location: apiJob.location || \"Remote\",\n                    salary: apiJob.salary || \"\",\n                    tags: apiJob.tags || [],\n                    posted: apiJob.date,\n                    jobUrl: `https://remoteok.io/l/${apiJob.id}`,\n                    description: apiJob.description || \"\",\n                    parsedDescription: {\n                        requirements: [],\n                        responsibilities: [],\n                        benefits: []\n                    }\n                };\n                // Basic parsing of description sections\n                const description = job.description.toLowerCase();\n                if (description.includes(\"requirements\")) {\n                    job.parsedDescription.requirements = description.split(\"requirements\")[1].split(\"\\n\").filter((line)=>line.trim().startsWith(\"-\")).map((line)=>line.replace(\"-\", \"\").trim());\n                }\n                if (description.includes(\"responsibilities\")) {\n                    job.parsedDescription.responsibilities = description.split(\"responsibilities\")[1].split(\"\\n\").filter((line)=>line.trim().startsWith(\"-\")).map((line)=>line.replace(\"-\", \"\").trim());\n                }\n                if (description.includes(\"benefits\")) {\n                    job.parsedDescription.benefits = description.split(\"benefits\")[1].split(\"\\n\").filter((line)=>line.trim().startsWith(\"-\")).map((line)=>line.replace(\"-\", \"\").trim());\n                }\n                jobs.push(job);\n            }\n        }\n        return jobs;\n    } catch (error) {\n        console.error(\"Error scraping RemoteOK:\", error);\n        throw new Error(\"Failed to scrape RemoteOK jobs\");\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cmFwZXJzL3JlbW90ZW9rLnRzPzVmN2EiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcblxuaW50ZXJmYWNlIEpvYiB7XG4gIGpvYklkOiBzdHJpbmc7XG4gIHBvc2l0aW9uOiBzdHJpbmc7XG4gIGNvbXBhbnk6IHN0cmluZztcbiAgbG9jYXRpb246IHN0cmluZztcbiAgc2FsYXJ5OiBzdHJpbmc7XG4gIHRhZ3M6IHN0cmluZ1tdO1xuICBwb3N0ZWQ6IHN0cmluZztcbiAgam9iVXJsOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHBhcnNlZERlc2NyaXB0aW9uOiB7XG4gICAgcmVxdWlyZW1lbnRzOiBzdHJpbmdbXTtcbiAgICByZXNwb25zaWJpbGl0aWVzOiBzdHJpbmdbXTtcbiAgICBiZW5lZml0czogc3RyaW5nW107XG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzY3JhcGVSZW1vdGVPSyh0aXRsZTogc3RyaW5nLCBsaW1pdDogbnVtYmVyID0gMTApOiBQcm9taXNlPEpvYltdPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHBzOi8vcmVtb3Rlb2suaW8vYXBpJywge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvOTEuMC40NDcyLjEyNCBTYWZhcmkvNTM3LjM2J1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGNvbnN0IGpvYnM6IEpvYltdID0gW107XG4gICAgY29uc3QgYXBpSm9icyA9IHJlc3BvbnNlLmRhdGEuc2xpY2UoMSk7IC8vIEZpcnN0IGl0ZW0gaXMgYSBub3RpY2VcblxuICAgIGZvciAoY29uc3QgYXBpSm9iIG9mIGFwaUpvYnMpIHtcbiAgICAgIGlmIChqb2JzLmxlbmd0aCA+PSBsaW1pdCkgYnJlYWs7XG5cbiAgICAgIGNvbnN0IGpvYlRpdGxlID0gYXBpSm9iLnBvc2l0aW9uO1xuICAgICAgaWYgKGpvYlRpdGxlLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGl0bGUudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgY29uc3Qgam9iOiBKb2IgPSB7XG4gICAgICAgICAgam9iSWQ6IGFwaUpvYi5pZC50b1N0cmluZygpLFxuICAgICAgICAgIHBvc2l0aW9uOiBqb2JUaXRsZSxcbiAgICAgICAgICBjb21wYW55OiBhcGlKb2IuY29tcGFueSxcbiAgICAgICAgICBsb2NhdGlvbjogYXBpSm9iLmxvY2F0aW9uIHx8ICdSZW1vdGUnLFxuICAgICAgICAgIHNhbGFyeTogYXBpSm9iLnNhbGFyeSB8fCAnJyxcbiAgICAgICAgICB0YWdzOiBhcGlKb2IudGFncyB8fCBbXSxcbiAgICAgICAgICBwb3N0ZWQ6IGFwaUpvYi5kYXRlLFxuICAgICAgICAgIGpvYlVybDogYGh0dHBzOi8vcmVtb3Rlb2suaW8vbC8ke2FwaUpvYi5pZH1gLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBhcGlKb2IuZGVzY3JpcHRpb24gfHwgJycsXG4gICAgICAgICAgcGFyc2VkRGVzY3JpcHRpb246IHtcbiAgICAgICAgICAgIHJlcXVpcmVtZW50czogW10sXG4gICAgICAgICAgICByZXNwb25zaWJpbGl0aWVzOiBbXSxcbiAgICAgICAgICAgIGJlbmVmaXRzOiBbXVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBCYXNpYyBwYXJzaW5nIG9mIGRlc2NyaXB0aW9uIHNlY3Rpb25zXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gam9iLmRlc2NyaXB0aW9uLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChkZXNjcmlwdGlvbi5pbmNsdWRlcygncmVxdWlyZW1lbnRzJykpIHtcbiAgICAgICAgICBqb2IucGFyc2VkRGVzY3JpcHRpb24ucmVxdWlyZW1lbnRzID0gZGVzY3JpcHRpb25cbiAgICAgICAgICAgIC5zcGxpdCgncmVxdWlyZW1lbnRzJylbMV1cbiAgICAgICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gbGluZS50cmltKCkuc3RhcnRzV2l0aCgnLScpKVxuICAgICAgICAgICAgLm1hcCgobGluZTogc3RyaW5nKSA9PiBsaW5lLnJlcGxhY2UoJy0nLCAnJykudHJpbSgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVzY3JpcHRpb24uaW5jbHVkZXMoJ3Jlc3BvbnNpYmlsaXRpZXMnKSkge1xuICAgICAgICAgIGpvYi5wYXJzZWREZXNjcmlwdGlvbi5yZXNwb25zaWJpbGl0aWVzID0gZGVzY3JpcHRpb25cbiAgICAgICAgICAgIC5zcGxpdCgncmVzcG9uc2liaWxpdGllcycpWzFdXG4gICAgICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+IGxpbmUudHJpbSgpLnN0YXJ0c1dpdGgoJy0nKSlcbiAgICAgICAgICAgIC5tYXAoKGxpbmU6IHN0cmluZykgPT4gbGluZS5yZXBsYWNlKCctJywgJycpLnRyaW0oKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uLmluY2x1ZGVzKCdiZW5lZml0cycpKSB7XG4gICAgICAgICAgam9iLnBhcnNlZERlc2NyaXB0aW9uLmJlbmVmaXRzID0gZGVzY3JpcHRpb25cbiAgICAgICAgICAgIC5zcGxpdCgnYmVuZWZpdHMnKVsxXVxuICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVxuICAgICAgICAgICAgLmZpbHRlcigobGluZTogc3RyaW5nKSA9PiBsaW5lLnRyaW0oKS5zdGFydHNXaXRoKCctJykpXG4gICAgICAgICAgICAubWFwKChsaW5lOiBzdHJpbmcpID0+IGxpbmUucmVwbGFjZSgnLScsICcnKS50cmltKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgam9icy5wdXNoKGpvYik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGpvYnM7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3Igc2NyYXBpbmcgUmVtb3RlT0s6JywgZXJyb3IpO1xuICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIHNjcmFwZSBSZW1vdGVPSyBqb2JzJyk7XG4gIH1cbn0gIl0sIm5hbWVzIjpbImF4aW9zIiwic2NyYXBlUmVtb3RlT0siLCJ0aXRsZSIsImxpbWl0IiwicmVzcG9uc2UiLCJnZXQiLCJoZWFkZXJzIiwiam9icyIsImFwaUpvYnMiLCJkYXRhIiwic2xpY2UiLCJhcGlKb2IiLCJsZW5ndGgiLCJqb2JUaXRsZSIsInBvc2l0aW9uIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImpvYiIsImpvYklkIiwiaWQiLCJ0b1N0cmluZyIsImNvbXBhbnkiLCJsb2NhdGlvbiIsInNhbGFyeSIsInRhZ3MiLCJwb3N0ZWQiLCJkYXRlIiwiam9iVXJsIiwiZGVzY3JpcHRpb24iLCJwYXJzZWREZXNjcmlwdGlvbiIsInJlcXVpcmVtZW50cyIsInJlc3BvbnNpYmlsaXRpZXMiLCJiZW5lZml0cyIsInNwbGl0IiwiZmlsdGVyIiwibGluZSIsInRyaW0iLCJzdGFydHNXaXRoIiwibWFwIiwicmVwbGFjZSIsInB1c2giLCJlcnJvciIsImNvbnNvbGUiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/scrapers/remoteok.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/bull","vendor-chunks/axios","vendor-chunks/semver","vendor-chunks/ioredis","vendor-chunks/next","vendor-chunks/asynckit","vendor-chunks/math-intrinsics","vendor-chunks/es-errors","vendor-chunks/uuid","vendor-chunks/cron-parser","vendor-chunks/call-bind-apply-helpers","vendor-chunks/debug","vendor-chunks/redis-errors","vendor-chunks/get-proto","vendor-chunks/detect-libc","vendor-chunks/standard-as-callback","vendor-chunks/redis-parser","vendor-chunks/node-gyp-build-optional-packages","vendor-chunks/mime-db","vendor-chunks/has-symbols","vendor-chunks/gopd","vendor-chunks/function-bind","vendor-chunks/form-data","vendor-chunks/follow-redirects","vendor-chunks/@ioredis","vendor-chunks/msgpackr","vendor-chunks/supports-color","vendor-chunks/proxy-from-env","vendor-chunks/msgpackr-extract","vendor-chunks/ms","vendor-chunks/mime-types","vendor-chunks/luxon","vendor-chunks/lodash.isarguments","vendor-chunks/lodash.defaults","vendor-chunks/hasown","vendor-chunks/has-tostringtag","vendor-chunks/has-flag","vendor-chunks/get-port","vendor-chunks/get-intrinsic","vendor-chunks/es-set-tostringtag","vendor-chunks/es-object-atoms","vendor-chunks/es-define-property","vendor-chunks/dunder-proto","vendor-chunks/denque","vendor-chunks/delayed-stream","vendor-chunks/combined-stream","vendor-chunks/cluster-key-slot"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fjobs%2Froute&page=%2Fapi%2Fjobs%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fjobs%2Froute.ts&appDir=%2FUsers%2Fsachanakshat%2FDownloads%2FOpenSource%2Fjob-board%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsachanakshat%2FDownloads%2FOpenSource%2Fjob-board&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();