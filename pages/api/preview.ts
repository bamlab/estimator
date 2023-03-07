import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../src/lib/prisma";

type Data = {
  success: boolean;
};

type Error = {
  message: string;
  error?: unknown;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) => {
  if (req.method === "POST") {
    if (!req.body.email) {
      return res.status(500).json({ message: "No email provided" });
    }
    try {
      await prisma.previewSubscription.create({
        data: { email: req.body.email },
      });
      return res.status(200).json({ success: true });
    } catch (e: unknown) {
      return res.status(500).json({ error: e, message: "A server occured" });
    }
  }

  res.status(404).json({ success: false });
};
