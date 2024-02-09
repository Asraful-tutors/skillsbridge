import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { User } from "@/lib/backend/user";
import { toResponse } from "@/lib/backend/errors";


export async function POST(request: Request) {
	try {
		User.register(new PrismaClient(), await request.json())
		return NextResponse.json({ message: "success" })

	} catch (e) {
		return toResponse(e);
	}

}