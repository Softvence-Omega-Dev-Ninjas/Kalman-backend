import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { StripeService } from '../stripe/stripe.service';
@Injectable()
export class ProposalService {
  constructor(
    private prisma: PrismaService,
    private stripe: StripeService,
  ) {}
  async create(createProposalDto: CreateProposalDto, tradesMan: any) {
    const isJobExist = await this.prisma.jobs.findUnique({
      where: {
        id: createProposalDto?.jobId,
      },
    });

    if (!isJobExist || !isJobExist.userId) {
      throw new HttpException(
        'Job not found or userId missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isTradesManExist = await this.prisma.tradesMan.findUnique({
      where: {
        userId: tradesMan?.id,
      },
    });
    if (!isTradesManExist) {
      throw new HttpException('Tradesman not found', HttpStatus.NOT_FOUND);
    }
    const isUserAlreadyAplied = await this.prisma.proposal.findFirst({
      where: {
        jobId: createProposalDto?.jobId,
        tradesManId: isTradesManExist?.id,
      },
    });

    if (isUserAlreadyAplied) {
      throw new HttpException(
        'Already applied for this job post',
        HttpStatus.CONFLICT,
      );
    }

    // 1. Check if the user is verified on stripe
    const isVerified = await this.stripe.isTradesmanVerified(
      isTradesManExist.stripeConnectId,
    );
    console.log({ isVerified });

    if (!isVerified) {
      // 2. If not then generate onboarding url
      const onboardingUrl = await this.stripe.createOnboardingLink(
        isTradesManExist.stripeConnectId,
      );

      throw new HttpException(
        {
          message:
            'You must complete your Stripe verification to continue. Redirecting to onboarding...',
          onboardingUrl,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 3. check if the trandsman have money?
    const isTradesManHaveBalance = await this.stripe.getBalance(
      isTradesManExist?.stripeConnectId,
    );
    console.dir({ isTradesManHaveBalance }, { depth: null });
    if (
      isTradesManHaveBalance?.available[0]?.amount < isJobExist?.shortlist_fee
    ) {
      // throw new HttpException(
      //   'You dont have enough balance to apply this job',
      //   HttpStatus.CONFLICT,
      // );
    }

    const result = await this.prisma.proposal.create({
      data: {
        ...createProposalDto,
        tradesManId: isTradesManExist?.id,
        userId: isJobExist.userId,
      },
    });
    return result;
  }

  async findAll() {
    const result = await this.prisma.proposal.findMany({
      include: {
        user: true,
        jobs: true,
        tradesMan: true,
      },
    });
    return result;
  }

  async findOne(id: string) {
    const result = await this.prisma.proposal.findUnique({
      where: {
        id,
      },
      include: {
        jobs: true,
        user: true,
        tradesMan: true,
      },
    });
    console.log({ result });
    if (!result) {
      throw new HttpException('No proposal found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async update(id: string, updateProposalDto: UpdateProposalDto, user: any) {
    const isProposalExist = await this.prisma.proposal.findUnique({
      where: {
        id,
      },
      include: {
        jobs: true,
        tradesMan: true,
      },
    });
    // if (isProposalExist?.jobs?.userId !== user?.id) {
    //   throw new HttpException(
    //     'You are not authorized to update the post',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    // if (isProposalExist?.status === updateProposalDto?.status) {
    //   throw new HttpException(
    //     `Proposal already in ${updateProposalDto?.status} state`,
    //     HttpStatus.CONFLICT,
    //   );
    // }

    // const addBalance = await this.stripe.addBalance(
    //   isProposalExist?.tradesMan?.stripeConnectId as string,
    // );
    // console.log({ addBalance });
    // return { addBalance };

    if (updateProposalDto?.status === 'REJECTED') {
      const result = await this.prisma.proposal.update({
        where: {
          id,
        },
        data: {
          status: updateProposalDto?.status,
        },
      });
      return result;
    }
    let amount = 0;
    let transactionId = '';
    console.log({ fee: isProposalExist?.jobs?.shortlist_fee });
    if (isProposalExist?.jobs?.shortlist_fee! == 0) {
      const balance = await this.stripe.getBalance(
        isProposalExist?.tradesMan?.stripeConnectId as string,
      );
      const availableAmount = balance.available?.[0]?.amount ?? 0;

      // if (availableAmount < isProposalExist?.jobs?.shortlist_fee!) {
      //   throw new HttpException(
      //     'Trades person run out of money',
      //     HttpStatus.NOT_ACCEPTABLE,
      //   );
      // }
      const transferAmount = await this.stripe.transferShortlistedAmount(
        isProposalExist?.jobs?.shortlist_fee as number,
        isProposalExist?.tradesMan.stripeConnectId as string,
      );

      amount = transferAmount.amount ?? 0;
      transactionId = transferAmount.id ?? '';
    }
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.proposal.update({
        where: {
          id,
        },
        data: {
          status: updateProposalDto?.status,
        },
      });
      const result = await tx.payment.create({
        data: {
          amount,
          transactionId,
          jobId: isProposalExist?.jobId as string,
          tradesManId: isProposalExist?.tradesManId as string,
        },
      });
      return result;
    });
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} proposal`;
  }
}
