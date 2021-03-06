import { delay } from "../util/delay";
import { EnsurancePlanType } from "./CarEnsurance.Client";
import { CarModel } from "./CarInventory.Client";
import moment from 'moment';

export type FinancingApproved = {
    isApproved: true,
    approvalToken: string,
    expiration?: Date
}

export type FinancingNotApproved = {
    isApproved: false,
    message: string
}

type GetApprovalResult = FinancingApproved | FinancingNotApproved;


const approvedFinacings: FinancingApproved[] = [];

function getApprovedFinancing(expiration?: Date) {

    const res = {
        isApproved: true as const,
        expiration: expiration,
        approvalToken: Math.random().toString()
    };

    approvedFinacings.push(res);

    return res
}

class FinancingClient {

    public async getMinimumPossibleDownpayment(
        carModel: CarModel,
        ensurancePlans: EnsurancePlanType[]): Promise<number> {

        console.log(`server call getMinimumPossibleDownpayment`);

        await delay(1000);

        if (ensurancePlans.some(x => x === EnsurancePlanType.assetProtection)) {
            return carModel.basePrice / 10;
        }

        return carModel.basePrice / 5;
    }

    public async getApproval(
        carModel: CarModel,
        ensurancePlans: EnsurancePlanType[],
        downpayment: number): Promise<GetApprovalResult> {

        console.log(`server call getApproval`);

        await delay(1000);

        //this would be calculated on the server

        if (ensurancePlans.some(x => x === EnsurancePlanType.assetProtection)
            && carModel.basePrice / 10 <= downpayment) {
            return getApprovedFinancing();
        }

        if (carModel.basePrice / 5 <= downpayment) {
            return getApprovedFinancing(
                moment().add(15 + Math.random() * 30, 's').toDate()
            );
        }

        return {
            isApproved: false,
            message: "Approval denied. Downpayment should be over 20% of base price (10% with 'asset protection' ensurance)."
        }
    }

    public async finalizeFinancing(approvalToken: string) {

        console.log(`server call finalizeFinancing`);

        await delay(500);

        return approvedFinacings.some(x =>
            x.approvalToken === approvalToken
            && (!x.expiration || x.expiration >= new Date())
        )
    };
}

export const financingClient = new FinancingClient();