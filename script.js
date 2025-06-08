// 오늘 날짜를 기본값으로 설정
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('mealDate').value = `${year}-${month}-${day}`;
    getMealInfo();
});

async function getMealInfo() {
    const dateInput = document.getElementById('mealDate').value;
    const date = dateInput.replace(/-/g, '');
    
    try {
        const response = await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7531100&MLSV_YMD=${date}`);
        const text = await response.text();
        
        const selectedDate = document.getElementById('selectedDate');
        const mealContent = document.getElementById('mealContent');
        
        // 날짜 표시 형식 변경 (YYYY-MM-DD -> YYYY년 MM월 DD일)
        const formattedDate = `${dateInput.substring(0, 4)}년 ${dateInput.substring(5, 7)}월 ${dateInput.substring(8, 10)}일`;
        selectedDate.textContent = formattedDate;

        // XML 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        
        // 에러 체크
        const error = xmlDoc.getElementsByTagName("ERROR");
        if (error.length > 0) {
            mealContent.textContent = '해당 날짜의 급식 정보가 없습니다.';
            return;
        }

        // 급식 정보 추출
        const row = xmlDoc.getElementsByTagName("row");
        if (row.length > 0) {
            const mealInfo = row[0];
            const menu = mealInfo.getElementsByTagName("DDISH_NM")[0].textContent;
            mealContent.textContent = menu;
        } else {
            mealContent.textContent = '급식 정보를 불러오는데 실패했습니다.';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('mealContent').textContent = '급식 정보를 불러오는데 실패했습니다.';
    }
}
