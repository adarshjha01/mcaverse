// import { NextResponse } from 'next/server';
// import { db } from '@/lib/firebaseAdmin';
// import { Dpp } from '@/types/dpp';

// export async function GET() {
//     try {
//         const questionsSnapshot = await db.collection('questions')
//             .where('difficulty', '==', 'Easy')
//             .get();

//         if (questionsSnapshot.empty) {
//             return NextResponse.json({ error: 'No easy questions available.' }, { status: 404 });
//         }


//         const randomIndex = Math.floor(Math.random() * allEasyQuestions.length);
//         const randomQuestion = allEasyQuestions[randomIndex];

//         return NextResponse.json({ question: randomQuestion });

//     } catch (error) {
//         console.error("Error fetching daily question:", error);
//         return NextResponse.json({ error: 'Failed to fetch daily question.' }, { status: 500 });
//     }
// }