// 구현된 기능
// 1. 포스트 목록 조회(카테고리, 태그)
// 2. 포스트 상세 조회
// 3. 댓글 (Giscus)
// 4. 방명록 (Giscus)


// 구현해야 할 기능
// 1. 페이지네이션
// 2. 방문자 수 조회

function Update() {
  const completedFeatures = [
    {
      id: 1,
      title: '포스트 목록 조회',
      description: '카테고리와 태그 기반 필터링 지원',
      date: '2025.02.11'
    },
    {
      id: 2,
      title: '포스트 상세 조회',
      description: '마크다운 렌더링 및 코드 하이라이팅',
      date: '2025.02.11'
    },
    {
      id: 3,
      title: '댓글 기능',
      description: 'Giscus를 활용한 깃허브 기반 댓글 시스템',
      date: '2025.02.12'
    },
    {
      id: 4,
      title: '방명록',
      description: 'Giscus를 활용한 방명록 시스템',
      date: '2025.02.12'
    },
    {
        id: 5,
        title: '업데이트 현황',
        description: '업데이트 현황 페이지',
        date: '2025.02.14'
      }
  ];

  const plannedFeatures = [
    {
      id: 1,
      title: '페이지네이션',
      description: '포스트 목록 페이지네이션 구현',
      expectedDate: '2024.02'
    },
    {
      id: 2,
      title: '방문자 수 조회',
      description: '페이지별 방문자 수 통계',
      expectedDate: '2024.03'
    },
    {
      id: 3,
      title: '다크모드 지원',
      description: '화면 설정에 따른 다크모드 지원',
      expectedDate: '2024.02'
    }
  ];

  // 구현된 기능을 날짜 내림차순으로 정렬 (최신순)
  const sortedCompletedFeatures = [...completedFeatures].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // 구현 예정 기능을 날짜 오름차순으로 정렬 (가까운 날짜순)
  const sortedPlannedFeatures = [...plannedFeatures].sort((a, b) => 
    new Date(a.expectedDate) - new Date(b.expectedDate)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">업데이트 현황</h1>
      
      {/* 구현 완료된 기능 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-green-600">구현된 기능</h2>
        <div className="border-l-2 border-green-200 ml-3">
          {sortedCompletedFeatures.map(feature => (
            <div 
              key={feature.id}
              className="relative mb-8 ml-6"
            >
              {/* 타임라인 도트 */}
              <div className="absolute -left-[1.875rem] mt-1.5">
                <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
              </div>
              
              {/* 날짜 */}
              <div className="text-sm text-gray-500 mb-1">
                {feature.date}
              </div>
              
              {/* 컨텐츠 */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-lg text-green-700">{feature.title}</h3>
                <p className="text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 구현 예정 기능 */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-blue-600">구현 예정 기능</h2>
        <div className="border-l-2 border-blue-200 ml-3">
          {sortedPlannedFeatures.map(feature => (
            <div 
              key={feature.id}
              className="relative mb-8 ml-6"
            >
              {/* 타임라인 도트 */}
              <div className="absolute -left-[1.875rem] mt-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
              </div>
              
              {/* 날짜 */}
              <div className="text-sm text-gray-500 mb-1">
                예정: {feature.expectedDate}
              </div>
              
              {/* 컨텐츠 */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-medium text-lg text-blue-700">{feature.title}</h3>
                <p className="text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Update;