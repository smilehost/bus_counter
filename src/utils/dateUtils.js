// Utility functions for Thai date formatting

/**
 * แปลงปี ค.ศ. เป็น พ.ศ.
 * @param {number} ceYear - ปี ค.ศ.
 * @returns {number} - ปี พ.ศ.
 */
export const toBuddhistYear = (ceYear) => ceYear + 543;

/**
 * แปลงปี พ.ศ. เป็น ค.ศ.
 * @param {number} beYear - ปี พ.ศ.
 * @returns {number} - ปี ค.ศ.
 */
export const toChristianYear = (beYear) => beYear - 543;

/**
 * แปลงวันที่จากรูปแบบ YYYY-MM-DD (ค.ศ.) เป็นรูปแบบไทย DD/MM/BBBB (พ.ศ.)
 * @param {string} dateString - วันที่ในรูปแบบ YYYY-MM-DD
 * @returns {string} - วันที่ในรูปแบบ DD/MM/BBBB
 */
export const formatDateToThai = (dateString) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;

    const beYear = toBuddhistYear(parseInt(year));
    return `${day}/${month}/${beYear}`;
};

/**
 * แปลงวันที่จากรูปแบบไทย DD/MM/BBBB (พ.ศ.) เป็น YYYY-MM-DD (ค.ศ.)
 * @param {string} thaiDateString - วันที่ในรูปแบบ DD/MM/BBBB
 * @returns {string} - วันที่ในรูปแบบ YYYY-MM-DD
 */
export const formatThaiDateToISO = (thaiDateString) => {
    if (!thaiDateString) return '';

    const [day, month, beYear] = thaiDateString.split('/');
    if (!day || !month || !beYear) return thaiDateString;

    const ceYear = toChristianYear(parseInt(beYear));
    return `${ceYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * แปลงวันที่เป็นรูปแบบไทยแบบเต็ม (เช่น "4 ธันวาคม 2568")
 * @param {string} dateString - วันที่ในรูปแบบ YYYY-MM-DD
 * @returns {string} - วันที่ในรูปแบบไทยแบบเต็ม
 */
export const formatDateToThaiLong = (dateString) => {
    if (!dateString) return '';

    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;

    const beYear = toBuddhistYear(parseInt(year));
    const monthName = thaiMonths[parseInt(month) - 1];
    const dayNum = parseInt(day);

    return `${dayNum} ${monthName} ${beYear}`;
};

/**
 * แปลง object ที่มีฟิลด์วันที่จาก ค.ศ. เป็น พ.ศ.
 * @param {Object} data - object ที่ต้องการแปลง
 * @param {Array<string>} dateFields - array ของชื่อฟิลด์ที่เป็นวันที่
 * @returns {Object} - object ที่แปลงวันที่เป็น พ.ศ. แล้ว
 */
export const convertDateFieldsToThai = (data, dateFields = []) => {
    if (!data) return data;

    const converted = { ...data };

    dateFields.forEach(field => {
        if (converted[field]) {
            converted[field] = formatDateToThai(converted[field]);
        }
    });

    return converted;
};
