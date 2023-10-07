/*
 * (http-headers.type.ts) HTTP standart header values
 * 
 * Copyright (c) 2023 Belousov Daniil
 * All rights reserved.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * Licensed under the 'GNU General Public License v3.0'
 * For more information, please refer to <https://www.gnu.org/licenses/gpl-3.0.html>
 */

/**
 * HTTP methods values
 */
export type HTTPContentType = 
    "application/java-archive" |
    "application/EDI-X12" |
    "application/javascript" |
    "application/xml" |
    "application/pdf" |
    "application/octet-stream" |
    "application/ogg" |
    "application/zip" |
    "application/xhtml+xml" |
    "application/x-shockwave-flash" |
    "application/json" |
    "application/x-www-form-urlencoded" |
    "application/ld+json" |
    "application/EDIFACT" |
    "audio/mpeg" |
    "audio/vnd.rn-realaudio" |
    "audio/x-wav" |
    "audio/x-ms-wma" |
    "image/gif" |
    "image/tiff" |
    "image/vnd.djvu" |
    "image/jpeg" |
    "image/svg+xml" |
    "image/png" |
    "image/x-icon" |
    "image/vnd.microsoft.icon" |
    "multipart/mixed" |
    "multipart/related" |
    "multipart/form-data" |
    "multipart/alternative" |
    "text/css" |
    "text/javascript (obsolete)" |
    "text/plain" |
    "text/html" |
    "text/xml" |
    "text/csv" |
    "video/mpeg" |
    "video/x-ms-wmv" |
    "video/x-msvideo" |
    "video/webm" |
    "video/mp4" |
    "video/x-flv" |
    "video/quicktime" |
    "application/vnd.android.package-archive" |
    "application/vnd.openxmlformats-officedocument.presentationml.presentation" |
    "application/vnd.mozilla.xul+xml" |
    "application/vnd.oasis.opendocument.text" |
    "application/vnd.oasis.opendocument.presentation" |
    "application/vnd.oasis.opendocument.spreadsheet" |
    "application/vnd.ms-powerpoint" |
    "application/vnd.oasis.opendocument.graphics" |
    "application/vnd.ms-excel" |
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" |
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" |
    "application/msword"
